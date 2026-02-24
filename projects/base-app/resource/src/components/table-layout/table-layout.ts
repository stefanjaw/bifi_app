import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  ResourceRef,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPaginated } from '../../libraries/pagination-utils';
import { DynamicComponentDirective } from '../../directives/dynamic-component';
import { PaginationManager } from '../../services/pagination-manager';
import { SortManager } from '../../services/sort-manager';
import { tableColumn } from '../../interfaces/table-column';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SortMeta } from 'primeng/api';
import { orderByQuery } from '../../interfaces/order-by';
import { PaginatorModule } from 'primeng/paginator';
import { Icon, Text } from '@avalantec/base-app/core';
import { tableRows } from '../../interfaces/table-row';
import { pagination } from '../../interfaces/pagination';
import { injectAuthService, permission } from '@avalantec/base-app/auth';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-app-table-layout',
  standalone: true,
  imports: [
    CommonModule,
    DynamicComponentDirective,
    TableModule,
    PaginatorModule,
    Icon,
    Text,
    ButtonModule,
  ],
  templateUrl: './table-layout.html',
  host: { class: 'shadow-xl/30 w-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLayout<T extends Record<string, any>> {
  // -----------------------------
  // DEPENDENCIES
  // -----------------------------
  private paginationManager = inject(PaginationManager);
  private sortManager = inject<SortManager<T>>(SortManager);
  private auth = injectAuthService();
  private destroy$ = inject(DestroyRef);

  // -----------------------------
  // INPUTS
  // -----------------------------
  data = input<ResourceRef<tableRows<T>> | tableRows<T>>();
  columns = input<tableColumn<T>[]>([]);
  onClickRow = input<(row: T) => void>();
  infiniteScroll = input<boolean>(false);

  // this is the permission that will be used to determine if the user has permission to click a row
  clickRowPermission = input<permission | undefined>(undefined);

  clickRowPermissionResource = computed(() =>
    this.auth.getPermissionResource(this.clickRowPermission())
  );
  clickRowPermissionAction = computed(() =>
    this.auth.getPermissionAction(this.clickRowPermission())
  );
  clickRowPermissionType = computed(() => this.auth.getPermissionType(this.clickRowPermission()));

  hasClickRowPermission = this.auth.createPermissionSignal({
    resource: this.clickRowPermissionResource,
    action: this.clickRowPermissionAction,
    type: this.clickRowPermissionType,
  });

  // -----------------------------
  // TEMPLATE REFERENCES
  // -----------------------------
  actions = contentChild('actions', { read: TemplateRef });
  expandContent = contentChild('expandContent', { read: TemplateRef });

  expandedRows: any = {};

  // -----------------------------
  // INTERNAL STATE
  // -----------------------------
  private scrollContainer = viewChild<ElementRef<HTMLDivElement>>('tableLayoutContainer');
  private loadingNextPage = false;

  private handleScroll = (event: Event) => this.onContainerScroll(event);

  isPaginatedFN = isPaginated;

  // -----------------------------
  // RESOURCE STATE
  // -----------------------------
  private lastValueCache: T[] | null = null;

  resourceState = computed(() => {
    const data = this.data();

    let isLoading = false;
    let error = null;
    let hasValue = false;
    let value: T[] = [];
    let pagination: pagination<T> | null = null;
    let isDataPaginated = false;

    if (Array.isArray(data)) {
      value = data;
      hasValue = true;
    } else if (this.isPaginatedFN(data)) {
      value = data.docs;
      pagination = data;
      isDataPaginated = true;
      hasValue = true;
    } else {
      isLoading = data?.isLoading() || false;
      error = data?.error();
      hasValue = data?.hasValue() || false;

      const resourceValue = data?.value();

      if (Array.isArray(resourceValue)) {
        value = resourceValue;
      } else if (isPaginated<T>(resourceValue)) {
        value = resourceValue.docs;
        pagination = resourceValue;
        isDataPaginated = true;
      }
    }

    // ---------- cache logic ----------
    // if hay value, we cache
    if (hasValue && Array.isArray(value) && value.length >= 0) {
      this.lastValueCache = value;
    }

    // if no value, we use the cache
    if (!hasValue && this.lastValueCache) {
      value = this.lastValueCache;
      hasValue = true;
    }
    // ----------------------------------

    return {
      isLoading,
      error,
      hasValue,
      isPaginated: isDataPaginated,
      pagination,
      value,
    };
  });
  // ...

  // -----------------------------
  // CONSTRUCTOR
  // -----------------------------

  /**
   * Constructor for the TableLayout component.
   * Resets the loadingNextPage flag when the resource is no longer loading.
   * Listens for scroll events on the container element.
   * Resets the pagination options when the component is destroyed.
   */
  constructor() {
    // Reset the loadingNextPage flag when the resource is no longer loading
    effect(() => {
      const state = this.resourceState();
      if (!state.isLoading) {
        this.loadingNextPage = false;
      }
    });

    // Listen for scroll events on the container element
    effect(() => {
      const scrollContainer = this.scrollContainer()?.nativeElement;

      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', this.handleScroll, {
          passive: true,
        });

        this.paginationManager.resetPaginationOptions();
      }
    });

    // Reset the pagination options
    this.destroy$.onDestroy(() => {
      const scrollContainer = this.scrollContainer()?.nativeElement;

      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', this.handleScroll);
      }
    });
  }

  // -----------------------------
  // SCROLL HANDLER
  // -----------------------------

  /**
   * Scroll handler for the container.
   * Checks if the user is at the bottom of the container and loads the next page if so.
   * @param event The scroll event
   */
  private onContainerScroll(event: Event) {
    const state = this.resourceState();

    if (state.isLoading || this.loadingNextPage) return;
    if (!state.pagination) return;

    const element = event.target as HTMLElement;

    const scrollTop = element.scrollTop;
    const viewportHeight = element.clientHeight;
    const fullHeight = element.scrollHeight;

    const threshold = 100;

    const atBottom = scrollTop + viewportHeight >= fullHeight - threshold;

    if (atBottom) {
      this.loadNextPage();
    }
  }

  /**
   * Load the next page of data.
   * If the limit is greater or equal to the total number of documents, do nothing.
   * Otherwise, increment the page number and the limit by the pivot value.
   * Set the loadingNextPage flag to true.
   * Call setPaginationOptions on the pagination manager with the updated page and limit.
   */
  private loadNextPage() {
    const state = this.resourceState();
    if (!state.pagination) return;

    const { page, totalDocs, limit } = state.pagination;

    // Si ya tenemos todos los documentos, no hacer nada
    if (limit >= totalDocs) return;

    const pivot = this.paginationManager.PIVOT;

    this.loadingNextPage = true;

    this.paginationManager.setPaginationOptions(page, limit + pivot);
  }

  // -----------------------------
  // TABLE EVENTS
  // -----------------------------

  /**
   * Event handler for the lazy load event.
   * Called when the table needs to load more data.
   * @param event The lazy load event
   * @internal
   */
  lazyLoad(event: TableLazyLoadEvent) {
    if (event.multiSortMeta) this.sort(event.multiSortMeta);

    if (event.rows || event.first) {
      const page = Math.floor((event.first || 1) / (event.rows || 5) + 1);
      this.changePage(page, event.rows || 5);
    }
  }

  /**
   * Changes the current page of the pagination options.
   * @param page The page number to change to
   * @param limit The number of items per page to change to
   */
  private changePage(page: number, limit: number) {
    this.paginationManager.setPaginationOptions(page, limit);
  }

  /**
   * Sorts the table based on the given sort meta data.
   * Removes any invalid sort meta data (i.e. sort by _id) from the given array.
   * @param multiSortMeta The sort meta data to sort by
   * @internal
   */
  private sort(multiSortMeta: SortMeta[]) {
    const invalidIdSortMeta = multiSortMeta.find(sort => sort.field === '_id');

    if (invalidIdSortMeta) {
      multiSortMeta.splice(multiSortMeta.indexOf(invalidIdSortMeta), 1);
    }

    this.sortManager.sortBy(
      multiSortMeta.map(sort => ({
        field: sort.field,
        order: sort.order === 1 ? 'asc' : 'desc',
      })) as orderByQuery<T>
    );
  }

  // -----------------------------
  // SAFE GET VALUE
  // -----------------------------

  /**
   * Safely gets the value of a nested property from an object.
   * If at any point the property is not found, returns null.
   * @param object The object to get the value from
   * @param path The path of the property to get, separated by dots
   * @returns The value of the property, or null if it was not found
   */
  getValue(object: any, path: string) {
    const keys = path.split('.');

    for (const key of keys) {
      if (object == null) return object;
      object = object[key];
    }

    return object;
  }
}
