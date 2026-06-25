import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CrudCompanies } from '../../services/crud-companies';
import { FormModule } from '@avalantec/base-app/form';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'bifi-app-company-detail',
  imports: [FormModule, RouterLink, ButtonModule, TableModule, TagModule, ProgressBarModule],
  templateUrl: './company-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDetail {
  private crudCompanies = inject(CrudCompanies);

  id = input<string>('');

  companyResource = this.crudCompanies.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });
  branchOfficesResource = this.crudCompanies.get({
    searchParams: computed(() => ({ type: 'branch-office' })),
  });

  company = this.companyResource.value;
  isLoading = computed(
    () => this.companyResource.isLoading() || this.branchOfficesResource.isLoading()
  );

  branches = computed(() => {
    const id = this.id();
    const all = this.branchOfficesResource.value();
    if (!all || !id) return [];
    return all.filter((b: any) => {
      const parent = b.parentCompany;
      return typeof parent === 'string' ? parent === id : parent?._id === id;
    });
  });
}
