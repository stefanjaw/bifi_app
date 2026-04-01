import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudPricingEstimate } from '../../services/crud-pricing-estimate';
import { pricingEstimate } from '../../interfaces/pricing-estimate';
import { pricingEstimateColumns } from '../../libraries/pricing-estimate-columns';
import { pricingEstimateFilters } from '../../libraries/pricing-estimate-filters';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';

@Component({
  selector: 'bifi-app-pricing-estimate-list',
  providers: [provideResourceManager(CrudPricingEstimate)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission],
  templateUrl: './pricing-estimate-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingEstimateListComponent {
  private resourceManager = inject<ResourceManager<pricingEstimate>>(ResourceManager);
  private router = inject(Router);

  columns = pricingEstimateColumns;
  filters = pricingEstimateFilters;
  entries = this.resourceManager.data;

  navigateToNew() {
    this.router.navigate(['/pricing/estimates/new']);
  }

  onClickRow = (row: pricingEstimate) => {
    this.router.navigate(['/pricing/estimates', row._id]);
  };
}
