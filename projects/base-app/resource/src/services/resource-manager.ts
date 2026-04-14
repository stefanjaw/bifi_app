import {
  afterNextRender,
  DestroyRef,
  effect,
  inject,
  Injectable,
  InjectionToken,
  Provider,
  ProviderToken,
  ResourceRef,
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

const RESOURCE_API_SERVICE_TOKEN = new InjectionToken<ApiRequestManager<unknown>>(
  'RESOURCE_API_SERVICE'
);

const RESOURCE_MODE_TOKEN = new InjectionToken<'paginated' | 'all'>('RESOURCE_MODE', {
  factory: () => 'paginated',
});

@Injectable()
export class ResourceManager<T> {
  private paginationManager = inject(PaginationManager);
  private sortManager = inject(SortManager);
  private filterManager = inject(FilterManager);
  private listStateManager = inject(ListStateManager);
  private document = inject(DOCUMENT);
  private route = inject(ActivatedRoute);
  private mode = inject(RESOURCE_MODE_TOKEN);
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

  // Paginated mode: exposes a page object (docs, totalDocs, page, limit, …)
  data!: ReturnType<ApiRequestManager<T>['getWithPagination']>;

  // Fetch-all mode: exposes the full flat array of records
  allData!: ResourceRef<T[]>;

  /**
   * Handles the side effects of setting the search params and resetting the
   * pagination options based on the presence of filters. Also resets the
   * filters and pagination options when the component is destroyed.
   */
  constructor() {
    // Restore saved state FIRST so that paginationOptions/sort reflect the
    // correct page before the resource is created below.
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

        // If the filter object contains the 'active' property, we set
        // _getInactive to null to include both active and inactive records.
        if (this.filterManager.hasActivePropertyUtil(filterObject)) this._getInactive.set(null);
        else this._getInactive.set(false);
      } else {
        this._searchParams.set({});
        this._getInactive.set(false);
      }
    });

    effect(() => {
      if (!this._restored()) return;

      const partial = this.listStateManager.partialSave();

      let state: Partial<ListState>;

      if (this.mode === 'all') {
        // Fetch-all mode: page/limit/sort are not meaningful — omit them from URL.
        state = {
          searchText: partial.searchText,
          filterRows: partial.filterRows,
        };
      } else {
        const pagination = this.paginationManager.paginationOptions();
        const sort = this.sortManager.sort();
        state = {
          page: pagination.page,
          limit: pagination.limit,
          sort: sort as ListState['sort'],
          searchText: partial.searchText,
          filterRows: partial.filterRows,
        };
      }

      untracked(() => this._replaceUrlState(state));
    });

    this.destroy$.onDestroy(() => {
      this._saveState();
      this._getInactive.set(false);
      this.listStateManager.clearPartialSave();
      this.listStateManager.clearPendingRestore();
    });

    // Create the resource LAST — after _restoreState() has already set the
    // correct page/limit on PaginationManager (paginated mode) or restored
    // filter state (all mode). This guarantees the resource fires once with
    // the correct initial state.
    if (this.mode === 'all') {
      this.allData = this.service.get({
        searchParams: this.searchParams,
        getInactive: this._getInactive,
        triggerRequest: this._trigger,
      }) as unknown as ResourceRef<T[]>;
    } else {
      this.data = this.service.getWithPagination({
        searchParams: this.searchParams,
        sort: this.sortManager.sort,
        paginateOptions: this.paginationManager.paginationOptions,
        getInactive: this._getInactive,
        triggerRequest: this._trigger,
      });
    }
  }

  /**
   * Silently patches the browser URL's query string with the current list
   * state, preserving any non-list-state query params already in the URL.
   *
   * Uses window.history.replaceState directly (via DOCUMENT injection) to
   * bypass Angular's Location service. Angular's Location.replaceState()
   * calls _notifyUrlChangeListeners() which triggers Router navigation —
   * causing the component to be destroyed/re-created and pagination to
   * oscillate. Calling window.history.replaceState directly emits no Angular
   * events at all.
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
   * then falls back to localStorage. In paginated mode, also restores
   * page/limit/sort on PaginationManager/SortManager immediately. In
   * fetch-all mode, only searchText/filterRows are restored (no pagination).
   */
  private _restoreState(): void {
    const queryParams = this.route.snapshot.queryParams as Record<string, string>;
    const fromQuery = this.listStateManager.parseQueryParams(queryParams);

    if (fromQuery) {
      this.listStateManager.setPendingRestore(fromQuery);
      if (this.mode !== 'all') {
        this.paginationManager.setPaginationOptions(fromQuery.page, fromQuery.limit);
        if (fromQuery.sort.length) this.sortManager.sortBy(fromQuery.sort as any);
      }
      return;
    }

    const fromStorage = this.listStateManager.loadFromLocalStorage(this.storageKey);
    if (fromStorage) {
      this.listStateManager.setPendingRestore(fromStorage);
      if (this.mode !== 'all') {
        this.paginationManager.setPaginationOptions(fromStorage.page, fromStorage.limit);
        if (fromStorage.sort.length) this.sortManager.sortBy(fromStorage.sort as any);
      }
    }
  }

  /**
   * Compiles the full list state and persists it to localStorage so it can
   * be restored on the next visit. In fetch-all mode, page/limit/sort are
   * not meaningful and are stored with sensible defaults.
   */
  private _saveState(): void {
    const partial = this.listStateManager.partialSave();

    let state: ListState;

    if (this.mode === 'all') {
      state = {
        searchText: partial.searchText ?? '',
        filterRows: partial.filterRows ?? [],
        page: 1,
        limit: 10,
        sort: [],
      };
    } else {
      const pagination = this.paginationManager.paginationOptions();
      const sort = this.sortManager.sort();
      state = {
        searchText: partial.searchText ?? '',
        filterRows: partial.filterRows ?? [],
        page: pagination.page,
        limit: pagination.limit,
        sort: sort as ListState['sort'],
      };
    }

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
 * Provides the ResourceManager service to the component tree.
 *
 * @param service The provider token of the ApiRequestManager service.
 * @param options.mode 'paginated' (default) uses getWithPagination() and exposes
 *   `data`. 'all' uses get() without pagination and exposes `allData` — required
 *   for views (Gantt, timeline) that need the full dataset upfront. All existing
 *   callers that omit `options` continue to work unchanged.
 */
export function provideResourceManager<T>(
  service: ProviderToken<ApiRequestManager<T>>,
  options?: { mode?: 'paginated' | 'all' }
): Provider[] {
  return [
    {
      provide: RESOURCE_API_SERVICE_TOKEN,
      useFactory: () => inject(service),
      deps: [service],
    },
    {
      provide: RESOURCE_MODE_TOKEN,
      useValue: options?.mode ?? 'paginated',
    },
    ResourceManager,
  ];
}

export function injectResourceManager<T>() {
  return inject(ResourceManager<T>);
}
