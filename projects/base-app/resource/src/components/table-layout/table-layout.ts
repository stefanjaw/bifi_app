import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
  ResourceRef,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPaginated } from '../../libraries/pagination-utils';
import { DynamicComponentDirective } from '../../directives/dynamic-component';
import { PaginationManager } from '../../services/pagination-manager';
import { SortManager } from '../../services/sort-manager';
import { tableColumn } from '../../interfaces/table-column';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SortMeta } from 'primeng/api';
import { ProgressBar } from 'primeng/progressbar';
import { orderByQuery } from '../../interfaces/order-by';
import { PaginatorModule } from 'primeng/paginator';
import { Icon } from '@avalantec/base-app/core';
import { tableRows } from '../../interfaces/table-row';
import { pagination } from '../../interfaces/pagination';

@Component({
  selector: 'bifi-app-table-layout',
  imports: [
    CommonModule,
    DynamicComponentDirective,
    TableModule,
    PaginatorModule,
    ProgressBar,
    Icon,
  ],
  templateUrl: './table-layout.html',
  host: { class: 'shadow-xl/30 w-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLayout<T extends Record<string, any>> {
  // Data managament
  private paginationManager = inject(PaginationManager);
  private sortManager = inject<SortManager<T>>(SortManager);

  // Inputs
  data = input<ResourceRef<tableRows<T>> | tableRows<T>>();

  // Columns managament
  columns = input<tableColumn<T>[]>([]);

  // State
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
    } else if (this.isPaginatedFN(data)) {
      // Case 2: When we get a paginated object, assign the data and the pagination object
      value = data.docs;
      pagination = data;
      isDataPaginated = true;
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

  // References
  actions = contentChild('actions', {
    read: TemplateRef,
  });

  isPaginatedFN = isPaginated;

  protected getValue(object: any, path: string) {
    const splittedPath = path.split('.');

    for (const key of splittedPath) {
      object = object[key];

      if (!object) break;
    }

    return object;
  }

  lazyLoad(event: TableLazyLoadEvent) {
    if (event.multiSortMeta) this.sort(event.multiSortMeta);
    if (event.rows || event.first) {
      // calculate page
      const page = Math.floor((event.first || 1) / (event.rows || 5) + 1);
      this.changePage(page, event.rows || 5);
    }
  }

  private changePage(page: number, limit: number) {
    this.paginationManager.setPaginationOptions(page, limit);
    console.log('change page', page, limit);
  }

  private sort(multiSortMeta: SortMeta[]) {
    this.sortManager.sortBy(
      multiSortMeta.map(sort => ({
        field: sort.field,
        order: sort.order === 1 ? 'asc' : 'desc',
      })) as orderByQuery<T>
    );
  }
}
