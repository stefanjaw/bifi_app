import { Component, inject, signal } from '@angular/core';
import { CrudCompanies } from '../../services/crud-companies';
import {
  paginationOptions,
  tableColumn,
  TableLayout,
} from '../../../../../system';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { company } from '../../interfaces/company';

@Component({
  selector: 'bifi-app-companies-list',
  imports: [TableLayout, MatMenuItem, MatIcon],
  templateUrl: './companies-list.html',
  styleUrl: './companies-list.css',
})
export class CompaniesList {
  private crudCompanies = inject(CrudCompanies);
  columns = signal<tableColumn<company>[]>([
    {
      field: 'name',
      title: 'Company Name',
      type: 'text',
    },
    {
      field: 'countryId.name',
      title: 'Country',
      type: 'text',
    },
    {
      field: 'address',
      title: 'Address',
      type: 'text',
    },
  ]);

  filters = signal<URLSearchParams>(new URLSearchParams());
  paginationOptions = signal<paginationOptions>({
    paginate: true,
    page: 1,
    limit: 5,
  });

  companies = this.crudCompanies.getWithPagination({
    searchParams: this.filters,
    paginateOptions: this.paginationOptions,
  });

  changePage(page: PageEvent) {
    this.paginationOptions.update((value) => ({
      ...value,
      limit: page.pageSize,
      page: page.pageIndex + 1,
    }));
  }
}
