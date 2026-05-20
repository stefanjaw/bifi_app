import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  inject,
  input,
  ResourceRef,
  signal,
  TemplateRef,
  untracked,
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

  // Infinite scroll accumulation — managed reactively via effect() in constructor.
  // Using signals (instead of plain mutable fields inside computed()) ensures
  // Angular's reactive system always sees every write and never skips an update.
  private _accumulatedPages = signal<number>(0);
  private _accumulatedDocs = signal<T[]>([]);

  // Simple cache used only in non-infinite-scroll mode to prevent loading flicker.
  private lastValueCache: T[] | null = null;

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

  constructor() {
    // Reactively accumulate pages as they arrive in infinite scroll mode.
    //
    // An effect() is the correct Angular primitive for this — it is designed
    // for side effects (writing to signals). A computed() must remain pure;
    // writing mutable class fields inside computed() is unreliable because
    // Angular may re-evaluate the computed at any time during its scheduling
    // cycle, causing the accumulated page counter to reset unexpectedly.
    effect(() => {
      if (!this.infiniteScroll()) return;

      const data = this.data();

      // Only handle ResourceRef inputs — skip plain arrays / plain pagination
      // objects passed directly (those don't use accumulation).
      if (!data || Array.isArray(data) || isPaginated(data)) return;

      const resourceValue = (data as ResourceRef<tableRows<T>>).value();
      if (!isPaginated<T>(resourceValue)) return;

      // Read the last accumulated page WITHOUT creating a reactive dependency.
      // If we tracked _accumulatedPages here the effect would re-run after
      // writing it, producing an infinite loop.
      const lastPage = untracked(() => this._accumulatedPages());

      if (resourceValue.page === 1) {
        // Filter / search reset — start accumulator fresh.
        this._accumulatedDocs.set([...resourceValue.docs]);
        this._accumulatedPages.set(1);
      } else if (resourceValue.page > lastPage) {
        // New page arrived — append to the existing accumulator.
        this._accumulatedDocs.update(prev => [...prev, ...resourceValue.docs]);
        this._accumulatedPages.set(resourceValue.page);
      }
    });
  }

  // -----------------------------
  // RESOURCE STATE
  // -----------------------------

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

    // ---------- cache / accumulation logic ----------
    if (this.infiniteScroll()) {
      // Infinite scroll mode: read from the reactively-managed accumulator.
      // The effect() above writes to _accumulatedDocs whenever a new page
      // arrives, keeping this computed pure — no side effects here.
      value = this._accumulatedDocs();

      // hasValue is true once the accumulator has any docs, or when we know
      // the result set is genuinely empty (totalDocs === 0 from the server).
      hasValue =
        value.length > 0 || (isDataPaginated && pagination !== null && pagination.totalDocs === 0);
    } else {
      // Regular (paginator) mode: simple cache to prevent loading flicker.
      if (hasValue && Array.isArray(value) && value.length >= 0) {
        this.lastValueCache = value;
      }
      if (!hasValue && this.lastValueCache) {
        value = this.lastValueCache;
        hasValue = true;
      }
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
    if (this.infiniteScroll()) return;

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
