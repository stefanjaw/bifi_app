import {
  afterNextRender,
  DestroyRef,
  effect,
  inject,
  Injectable,
  InjectionToken,
  Provider,
  ProviderToken,
  signal,
  untracked,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PaginationManager } from './pagination-manager';
import { FilterManager } from './filter-manager';
import { SortManager } from './sort-manager';
import { ApiRequestManager } from './api-request-manager';
import { ListState, ListStateManager } from './list-state-manager';

// Injection token to be used in the resource manager to access the ApiRequestManager
const RESOURCE_API_SERVICE_TOKEN = new InjectionToken<ApiRequestManager<unknown>>(
  'RESOURCE_API_SERVICE'
);

@Injectable()
export class ResourceManager<T> {
  private paginationManager = inject(PaginationManager);
  private sortManager = inject(SortManager);
  private filterManager = inject(FilterManager);
  private listStateManager = inject(ListStateManager);
  private document = inject(DOCUMENT);
  private route = inject(ActivatedRoute);
  // Deep equality prevents spurious re-fetches when the filter effect sets a
  // new `{}` object with the same content (e.g. no active filters).
  private _searchParams = signal<Record<string, any>>(
    {},
    { equal: (a, b) => JSON.stringify(a) === JSON.stringify(b) }
  );
  private service = inject<ApiRequestManager<T>>(RESOURCE_API_SERVICE_TOKEN);
  private destroy$ = inject(DestroyRef);
  private _getInactive = signal<boolean | null>(false);
  private storageKey = `bifi_list_${this.service.endpoint}`;

  toggleInactiveRecords = () => this._getInactive.update(value => !value);

  // triggering:
  private _restored = signal(false);
  private _trigger = signal(false);
  data!: ReturnType<ApiRequestManager<T>['getWithPagination']>;

  /**
   * Handles the side effects of setting the search params and resetting the pagination options based on the presence of filters.
   * Also resets the filters and pagination options when the component is destroyed.
   */
  constructor() {
    // Restore saved state FIRST so that paginationOptions/sort reflect the
    // correct page before `data` (the rxResource) is created below.
    this._restoreState();

    afterNextRender(() => {
      this._restored.set(true);
      this._trigger.set(true);
    });

    effect(() => {
      const filters = this.filterManager.filters();

      if (filters.length > 0) {
        const filterObject = this.filterManager.getFilterObject();

        this._searchParams.set(filterObject);

        // If the filter object contains the 'active' property, we set _getInactive to null to include both active and inactive records in the results.
        if (this.filterManager.hasActivePropertyUtil(filterObject)) this._getInactive.set(null);
        else this._getInactive.set(false);
      } else {
        this._searchParams.set({});
        this._getInactive.set(false);
      }
    });

    effect(() => {
      if (!this._restored()) return;

      const pagination = this.paginationManager.paginationOptions();
      const sort = this.sortManager.sort();
      const partial = this.listStateManager.partialSave();

      const state: Partial<ListState> = {
        page: pagination.page,
        limit: pagination.limit,
        sort: sort as ListState['sort'],
        searchText: partial.searchText,
        filterRows: partial.filterRows,
      };

      untracked(() => this._replaceUrlState(state));
    });

    this.destroy$.onDestroy(() => {
      this._saveState();
      this._getInactive.set(false);
      this.listStateManager.clearPartialSave();
      this.listStateManager.clearPendingRestore();
    });

    // Create the paginated resource LAST — after _restoreState() has already
    // set the correct page/limit on PaginationManager. This guarantees that
    // rxResource's internal effect fires once with the restored page rather
    // than the default page=1, eliminating the spurious initial page=1 request
    // that previously appeared in backend logs before the correct page request.
    this.data = this.service.getWithPagination({
      searchParams: this.searchParams,
      sort: this.sortManager.sort,
      paginateOptions: this.paginationManager.paginationOptions,
      getInactive: this._getInactive,
      triggerRequest: this._trigger,
    });
  }

  /**
   * Silently patches the browser URL's query string with the current list state,
   * preserving any non-list-state query params already in the URL.
   *
   * Uses window.history.replaceState directly (via DOCUMENT injection) to bypass
   * Angular's Location service. Angular's Location.replaceState() calls
   * _notifyUrlChangeListeners() which triggers Router navigation — causing the
   * component to be destroyed/re-created and pagination to oscillate. Calling
   * window.history.replaceState directly emits no Angular events at all.
   *
   * window.location always reflects the real browser URL including any previous
   * history.replaceState calls, so merging with existing params is always accurate.
   */
  private lastUrlState = '';

  private _replaceUrlState(state: Partial<ListState>): void {
    const win = this.document.defaultView;
    if (!win) return;

    const basePath = win.location.pathname;
    const existingParams = new URLSearchParams(win.location.search);
    const listParams = this.listStateManager.buildQueryParams(state);

    Object.entries(listParams).forEach(([key, value]) => {
      if (value === null || value === undefined) existingParams.delete(key);
      else existingParams.set(key, value);
    });

    const newSearch = existingParams.toString();
    const newUrl = basePath + (newSearch ? '?' + newSearch : '');

    if (this.lastUrlState === newUrl) return;
    this.lastUrlState = newUrl;

    win.history.replaceState(win.history.state, '', newUrl);
  }

  /**
   * On init, attempts to restore list state from URL query params first,
   * then falls back to localStorage. Restored state is applied to
   * PaginationManager/SortManager immediately, and made available to
   * FilterBar/SearchBar via ListStateManager.pendingRestore.
   */
  private _restoreState(): void {
    const queryParams = this.route.snapshot.queryParams as Record<string, string>;
    const fromQuery = this.listStateManager.parseQueryParams(queryParams);

    if (fromQuery) {
      this.listStateManager.setPendingRestore(fromQuery);
      this.paginationManager.setPaginationOptions(fromQuery.page, fromQuery.limit);
      if (fromQuery.sort.length) this.sortManager.sortBy(fromQuery.sort as any);
      return;
    }

    const fromStorage = this.listStateManager.loadFromLocalStorage(this.storageKey);

    if (fromStorage) {
      this.listStateManager.setPendingRestore(fromStorage);
      this.paginationManager.setPaginationOptions(fromStorage.page, fromStorage.limit);
      if (fromStorage.sort.length) this.sortManager.sortBy(fromStorage.sort as any);
    }
  }

  /**
   * Compiles the full list state from PaginationManager, SortManager, and the
   * partial state saved by FilterBar/SearchBar, then persists it to localStorage
   * so it can be restored on the next visit.
   */
  private _saveState(): void {
    const pagination = this.paginationManager.paginationOptions();
    const sort = this.sortManager.sort();
    const partial = this.listStateManager.partialSave();

    const state: ListState = {
      searchText: partial.searchText ?? '',
      filterRows: partial.filterRows ?? [],
      page: pagination.page,
      limit: pagination.limit,
      sort: sort as ListState['sort'],
    };

    this.listStateManager.saveToLocalStorage(this.storageKey, state);
  }

  get searchParams() {
    return this._searchParams;
  }

  get getInactiveStatus() {
    return this._getInactive;
  }
}

/**
 * Provides the resource manager service to the component tree.
 *
 * @param service The provider token of the api request manager service to be used by the resource manager.
 * @returns An array of providers that can be used in the component's or module's @NgModule decorator.
 */
export function provideResourceManager<T>(
  service: ProviderToken<ApiRequestManager<T>>
): Provider[] {
  return [
    {
      provide: RESOURCE_API_SERVICE_TOKEN,
      useFactory: () => inject(service),
      deps: [service],
    },
    ResourceManager,
  ];
}

export function injectResourceManager<T>() {
  return inject(ResourceManager<T>);
}
