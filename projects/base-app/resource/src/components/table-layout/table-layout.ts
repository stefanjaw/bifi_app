import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
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
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SortMeta } from 'primeng/api';
import { orderByQuery } from '../../interfaces/order-by';
import { PaginatorModule } from 'primeng/paginator';
import { Icon } from '@avalantec/base-app/core';
import { tableRows } from '../../interfaces/table-row';
import { pagination } from '../../interfaces/pagination';
import { injectAuthService, permission } from '@avalantec/base-app/auth';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-app-table-layout',
  imports: [
    CommonModule,
    DynamicComponentDirective,
    TableModule,
    PaginatorModule,
    Icon,
    ButtonModule,
  ],
  templateUrl: './table-layout.html',
  host: { class: 'shadow-xl/30 w-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLayout<T extends Record<string, any>> {
  // Data managament
  private paginationManager = inject(PaginationManager);
  private sortManager = inject<SortManager<T>>(SortManager);
  private auth = injectAuthService();

  // Inputs
  data = input<ResourceRef<tableRows<T>> | tableRows<T>>();
  columns = input<tableColumn<T>[]>([]);
  onClickRow = input<(row: T) => void>();
  infiniteScroll = input<boolean>(false);

  // ViewChild
  tableContainer = viewChild(Table);

  //#region Permission for row click
  // * The permission input
  clickRowPermission = input<permission | undefined>(undefined);

  // * Resource for that permission
  clickRowPermissionResource = computed(() =>
    this.auth.getPermissionResource(this.clickRowPermission())
  );

  // * Action for that permission
  clickRowPermissionAction = computed(() =>
    this.auth.getPermissionAction(this.clickRowPermission())
  );

  // * Type for that permission
  clickRowPermissionType = computed(() => this.auth.getPermissionType(this.clickRowPermission()));

  // * Signal to give permission
  hasClickRowPermission = this.auth.createPermissionSignal({
    resource: this.clickRowPermissionResource,
    action: this.clickRowPermissionAction,
    type: this.clickRowPermissionType,
  });
  //#endregion

  // State
  actions = contentChild('actions', {
    read: TemplateRef,
  });

  expandContent = contentChild('expandContent', {
    read: TemplateRef,
  });

  // Table state for expanded rows
  expandedRows: any = {};

  resourceState = computed(() => {
    const data = this.data();
    let isLoading = false;
    let error = null;
    let hasValue = false;
    let value: T[] = [];
    let pagination: pagination<T> | null = null;
    let isDataPaginated = false;

    if (Array.isArray(data)) {
      // Case 1: When we get an array of items, assign the data
      value = data;
      hasValue = true;
    } else if (this.isPaginatedFN(data)) {
      // Case 2: When we get a paginated object, assign the data and the pagination object
      value = data.docs;
      pagination = data;
      isDataPaginated = true;
      hasValue = true;
    } else {
      // Case 3: When we get a resource ref, assign the data
      isLoading = data?.isLoading() || false;
      error = data?.error();
      hasValue = data?.hasValue() || false;

      // Get the resource value and update the props
      const resourceValue = data?.value();
      if (Array.isArray(resourceValue)) {
        value = resourceValue;
      } else if (isPaginated<T>(resourceValue)) {
        value = resourceValue.docs;
        pagination = resourceValue;
        isDataPaginated = true;
      }
    }

    return {
      isLoading,
      error,
      hasValue,
      isPaginated,
      pagination,
      isDataPaginated,
      value,
    };
  });

  isPaginatedFN = isPaginated;

  /**
   * Recursively gets the value of an object by following the given path.
   * If the path is invalid, it will return undefined.
   * @param {any} object - The object to get the value from.
   * @param {string} path - The path to get the value from.
   * @returns {any} The value of the object at the given path.
   */
  getValue(object: any, path: string) {
    const splittedPath = path.split('.');

    for (const key of splittedPath) {
      object = object[key];

      if (!object) break;
    }

    return object;
  }

  /**
   * Triggered when the user scrolls to the end of the table or when the rows change.
   * If multiSortMeta is present, it will trigger the sort method with the given SortMeta array.
   * If rows or first are present, it will calculate the next page and trigger the changePage method with the next page and limit.
   * @param event - The TableLazyLoadEvent emitted by the PrimeNG Table component.
   */
  lazyLoad(event: TableLazyLoadEvent) {
    if (event.multiSortMeta) this.sort(event.multiSortMeta);
    if (event.rows || event.first) {
      // calculate page
      const page = Math.floor((event.first || 1) / (event.rows || 5) + 1);
      this.changePage(page, event.rows || 5);
    }
  }

  /**
   * Triggered when the user scrolls to the end of the table or when the rows change.
   * Changes the pagination options to the given page and limit.
   * @param page - The page number to change to.
   * @param limit - The number of items per page.
   */
  private changePage(page: number, limit: number) {
    this.paginationManager.setPaginationOptions(page, limit);
  }

  /**
   * Triggered when the user changes the sort order.
   * Sorts the data according to the given SortMeta array.
   * @param multiSortMeta - The array of SortMeta objects, each containing a field and order.
   */
  private sort(multiSortMeta: SortMeta[]) {
    this.sortManager.sortBy(
      multiSortMeta.map(sort => ({
        field: sort.field,
        order: sort.order === 1 ? 'asc' : 'desc',
      })) as orderByQuery<T>
    );
  }
}
