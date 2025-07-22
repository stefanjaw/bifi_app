import { Component, inject } from '@angular/core';
import { CrudCompanies } from '../../services/crud-companies';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { company } from '../../interfaces/company';
import { companyColumns } from '../../libraries/company-columns';
import { companyFilters } from '../../libraries/company-filters';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';

@Component({
  selector: 'bifi-app-companies-list',
  providers: [provideResourceManager(CrudCompanies)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, MatMenuItem, MatIcon, SearchBar],
  templateUrl: './companies-list.html',
  styleUrl: './companies-list.css',
})
export class CompaniesList {
  private resourceManager = inject<ResourceManager<company>>(ResourceManager);

  companyColumns = companyColumns;
  companyFilters = companyFilters;

  companies = this.resourceManager.data;
}
