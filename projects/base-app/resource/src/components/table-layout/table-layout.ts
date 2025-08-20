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
import { pagination } from '../../interfaces/pagination';
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
  data = input<ResourceRef<T[] | pagination<T> | undefined>>();

  // Columns managament
  columns = input<tableColumn<T>[]>([]);

  // State
  elementsToDisplay = computed(() => {
    const data = this.data()?.value();

    if (!data) return [];

    if (isPaginated(data)) return data.docs;
    else return data;
  });

  // Pagination data
  paginationData = computed(() => {
    const data = this.data()?.value();

    if (!data) return undefined;
    else if (isPaginated(data)) return data;
    else return undefined;
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
