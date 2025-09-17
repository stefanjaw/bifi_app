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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';

@Component({
  selector: 'bifi-app-policies-list',
  providers: [provideResourceManager(CrudPolicies)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink, HasPermission],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './policies-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoliciesList {
  private resourceManager = inject<ResourceManager<policy<string, string>>>(ResourceManager);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  policyColumns = policyColumns;
  policyFilters = policyFilters;

  policies = this.resourceManager.data;

  goToCreate() {
    this.router.navigate(['create'], { relativeTo: this.route.parent });
  }

  goToEdit(_id: string) {
    this.router.navigate(['edit', _id], { relativeTo: this.route.parent });
  }
}
