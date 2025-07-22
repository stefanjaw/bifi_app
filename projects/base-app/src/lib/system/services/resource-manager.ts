import {
  DestroyRef,
  effect,
  inject,
  Injectable,
  InjectionToken,
  Provider,
  ProviderToken,
  signal,
} from '@angular/core';
import { PaginationManager } from './pagination-manager';
import { FilterManager } from './filter-manager';
import { ApiRequestManager } from './api-request-manager';
import { SortManager } from './sort-manager';

// Injection token to be used in the resource manager to access the ApiRequestManager
const RESOURCE_API_SERVICE_TOKEN = new InjectionToken<ApiRequestManager<unknown>>(
  'RESOURCE_API_SERVICE'
);

@Injectable()
export class ResourceManager<T> {
  private paginationManager = inject(PaginationManager);
  private sortManager = inject(SortManager);
  private filterManager = inject(FilterManager);
  private _searchParams = signal({});
  private service = inject<ApiRequestManager<T>>(RESOURCE_API_SERVICE_TOKEN);
  private destroy$ = inject(DestroyRef);

  /**
   * Handles the side effects of setting the search params and resetting the pagination options based on the presence of filters.
   * Also resets the filters and pagination options when the component is destroyed.
   */
  constructor() {
    effect(() => {
      const filters = this.filterManager.filters();

      if (filters.length > 0) {
        this._searchParams.set(this.filterManager.getFilterObject('or'));
      } else {
        this._searchParams.set({});
      }

      this.paginationManager.resetPaginationOptions();
    });

    this.destroy$.onDestroy(() => {
      this.paginationManager.resetPaginationOptions();
      this.filterManager.clearFilters();
      this.sortManager.resetSorts();
    });
  }

  /** Paginated and filtered data */
  data = this.service.getWithPagination({
    searchParams: this.searchParams,
    sort: this.sortManager.sort,
    paginateOptions: this.paginationManager.paginationOptions,
  });

  get searchParams() {
    return this._searchParams;
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
