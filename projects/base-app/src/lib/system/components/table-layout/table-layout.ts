import {
  Component,
  computed,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { tableColumn } from '../../interfaces/table-column';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

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
  ],
  templateUrl: './table-layout.html',
  styleUrl: './table-layout.css',
})
export class TableLayout {
  actions = input<TemplateRef<MatMenuItem[]>>();

  // Viewchild
  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);

  // Data managament
  data = input<Record<string, any>[]>([]);

  source = computed(() => {
    const data = this.data();
    const paginator = this.paginator();
    const sort = this.sort();

    const source = new MatTableDataSource<Record<string, any>>();

    if (data.length > 0) source.data = data;
    if (paginator) source.paginator = paginator;
    if (sort) source.sort = sort;

    return source;
  });

  // Columns managament
  columns = input<tableColumn[]>([]);

  columnsAsString = computed(() => {
    const columns = this.columns().map((column) => column.field);

    if (this.actions()) columns.push('actions');
    return columns;
  });
}
