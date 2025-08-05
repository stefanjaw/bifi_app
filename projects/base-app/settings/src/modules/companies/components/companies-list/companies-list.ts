import { Component, inject } from '@angular/core';
import { CrudCompanies } from '../../services/crud-companies';
import { company } from '../../interfaces/company';
import { companyColumns } from '../../libraries/company-columns';
import { companyFilters } from '../../libraries/company-filters';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-app-companies-list',
  providers: [provideResourceManager(CrudCompanies)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule],
  templateUrl: './companies-list.html',
  styleUrl: './companies-list.css',
})
export class CompaniesList {
  private resourceManager = inject<ResourceManager<company>>(ResourceManager);

  companyColumns = companyColumns;
  companyFilters = companyFilters;

  companies = this.resourceManager.data;
}
