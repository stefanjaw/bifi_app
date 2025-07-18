import {
  Component,
  computed,
  contentChild,
  inject,
  input,
  ResourceRef,
  TemplateRef,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { tableColumn } from '../../interfaces/table-column';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { pagination } from '../../interfaces/pagination';
import { isPaginated } from '../../libraries/object-utils';
import { MatProgressBar } from '@angular/material/progress-bar';
import { PaginationManager } from '../../services/pagination-manager';
import { DynamicComponentDirective } from '../../directives/dynamic-component';

@Component({
  selector: 'bifi-app-table-layout',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatIconButton,
    MatIcon,
    CommonModule,
    MatProgressBar,
    DynamicComponentDirective,
  ],
  templateUrl: './table-layout.html',
  host: { class: 'shadow-xl/30 w-full' },
  styleUrl: './table-layout.css',
})
export class TableLayout<T extends Record<string, any>> {
  // Data managament
  private paginationManager = inject(PaginationManager);
  data = input<ResourceRef<T[] | pagination<T> | undefined>>();
  isPaginatedFN = isPaginated;
  actions = contentChild('actions', {
    read: TemplateRef,
  });

  elementsToDisplay = computed(() => {
    const data = this.data()?.value();

    if (!data) return [];
    else if (isPaginated(data)) return data.docs;
    else return data;
  });

  // Columns managament
  columns = input<tableColumn<T>[]>([]);

  columnsAsString = computed(() => {
    const columns = this.columns().map((column) => column.field.toString());

    if (this.actions()) columns.push('actions');
    return columns;
  });

  getValue(object: any, path: string) {
    const splittedPath = path.split('.');

    for (let key of splittedPath) {
      object = object[key];

      if (!object) break;
    }

    return object;
  }

  changePage(event: PageEvent) {
    this.paginationManager.setPaginationOptions(
      event.pageIndex + 1, // Page starts at 0
      event.pageSize,
    );
  }

  castToPaginate() {
    return this.data()?.value() as pagination<T>;
  }
}
