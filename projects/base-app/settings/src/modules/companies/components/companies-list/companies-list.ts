import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
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
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bifi-app-companies-list',
  providers: [provideResourceManager(CrudCompanies)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink],
  templateUrl: './companies-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesList {
  private resourceManager = inject<ResourceManager<company>>(ResourceManager);
  private crudCompanies = inject(CrudCompanies);
  private destroy$ = inject(DestroyRef);

  companyColumns = companyColumns;
  companyFilters = companyFilters;

  companies = this.resourceManager.data;

  deleteCompany(id: string) {
    this.crudCompanies
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.companies.reload();
        },
      });
  }
}
