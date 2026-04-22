import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
  ResourceRef,
  TemplateRef,
  AfterViewInit,
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
import { InfiniteScroll } from '../../directives/infinite-scroll';

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
    InfiniteScroll,
  ],
  templateUrl: './table-layout.html',
  host: { class: 'shadow-xl/30 w-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLayout<T extends Record<string, any>> implements AfterViewInit {
  // -----------------------------
  // DEPENDENCIES
  // -----------------------------
  private paginationManager = inject(PaginationManager);
  private sortManager = inject<SortManager<T>>(SortManager);
  private auth = injectAuthService();

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
  isPaginatedFN = isPaginated;
  private skipNextLazyLoad = true;
  firstSet = false;

  allLoaded = computed(() => {
    if (!this.infiniteScroll()) return false;
    const state = this.resourceState();
    if (!state.isPaginated || !state.pagination) return false;
    return !state.pagination.hasNextPage;
  });

  // Derived from PaginationManager so p-table always initialises at the correct
  // page — even before the first API response arrives. Without this, p-table
  // would start with [first]="0" and immediately fire lazyLoad(first=0) which
  // resets pagination back to page 1, overwriting any restored state.
  paginatorFirst = computed(() => {
    const opts = this.paginationManager.paginationOptions();
    return (opts.page - 1) * opts.limit;
  });

  paginatorRows = computed(() => this.paginationManager.paginationOptions().limit);

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

  ngAfterViewInit() {
    // Usamos setTimeout para asegurar que pase un ciclo de renderizado completo
    // y PrimeNG ya no intente "resetear" el paginador a 0
    setTimeout(() => {
      this.firstSet = true;
    }, 0);
  }

  // -----------------------------
  // TABLE EVENTS
  // -----------------------------

  /**
   * Called when the table is lazy loaded. This function checks if the pagination options of the table
   * have changed and if so, it updates the pagination options and calls the sort function if needed.
   * If the new page is 1 and the current page is not 1, it does nothing.
   *
   * @param event - The TableLazyLoadEvent emitted by the table when lazy loaded.
   */
  lazyLoad(event: TableLazyLoadEvent) {
    const state = this.resourceState(); // Obtenemos el estado actual del resource

    // BLOQUEO CRÍTICO:
    // Si el recurso está cargando por primera vez y aún no tiene valores,
    // ignoramos cualquier evento de la tabla. Esto evita que el 'first: 0'
    // de PrimeNG sobreescriba la página restaurada.
    if (state.isLoading && !state.hasValue) {
      return;
    }

    // Si aún no hemos pasado el AfterViewInit, ignoramos.
    if (!this.firstSet) return;

    if (event.multiSortMeta) this.sort(event.multiSortMeta);

    if (event.rows != null || event.first != null) {
      const page =
        Math.floor((event.first ?? 0) / (event.rows || this.paginationManager.PIVOT)) + 1;

      const current = this.paginationManager.paginationOptions();
      // Solo disparamos si el cambio es real
      if (current.page !== page || current.limit !== (event.rows || this.paginationManager.PIVOT)) {
        this.changePage(page, event.rows || this.paginationManager.PIVOT);
      }
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
