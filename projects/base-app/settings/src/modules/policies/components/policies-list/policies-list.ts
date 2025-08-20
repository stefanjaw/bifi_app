import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudPolicies } from '../../services/crud-policies';
import { ButtonModule } from 'primeng/button';
import { policy } from '@avalantec/base-app/core';
import { policyColumns } from '../../libraries/policy-columns';
import { policyFilters } from '../../libraries/policy-filters';

@Component({
  selector: 'bifi-app-policies-list',
  providers: [provideResourceManager(CrudPolicies)],
  imports: [TableLayout, ButtonModule, SearchBar],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './policies-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoliciesList {
  private resourceManager = inject<ResourceManager<policy<string, string>>>(ResourceManager);

  policyColumns = policyColumns;
  policyFilters = policyFilters;

  policies = this.resourceManager.data;
}
