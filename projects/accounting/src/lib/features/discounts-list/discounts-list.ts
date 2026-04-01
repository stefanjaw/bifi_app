import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudDiscounts } from '../../services/crud-discounts';
import { discount } from '../../interfaces/discount';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { discountColumns } from '../../libraries/discount-columns';
import { discountFilters } from '../../libraries/discount-filters';

@Component({
  selector: 'bifi-app-discounts-list',
  providers: [provideResourceManager(CrudDiscounts)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink, ButtonsActions],  templateUrl: './discounts-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountsList {
  private resourceManager = inject<ResourceManager<discount>>(ResourceManager);
  private crudDiscounts = inject(CrudDiscounts);
  private destroy$ = inject(DestroyRef);

  //Router
  private router = inject(Router)
  private route = inject(ActivatedRoute);

  columns = discountColumns;
  filters = discountFilters;
  discounts = this.resourceManager.data;


  goToEditDiscount = (element: discount) => {
    this.router.navigate(['../discounts/edit/', element._id], { relativeTo: this.route });
  }
  deleteDiscount(id: string) {
    this.crudDiscounts
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: res => { if (res) this.discounts.reload(); } });
  }
}
