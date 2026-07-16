import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {
  TableLayout,
  SearchBar,
  ButtonsActions,
  ResourceManager,
  provideResourceManager,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CrudOrderSets } from '../../services/crud-order-sets';
import { orderSetColumns } from '../../routes/clinical-orders-columns';
import { orderSetFilters } from '../../routes/clinical-orders-filters';
import { orderSet } from '../../interfaces/clinical-orders';

@Component({
  selector: 'bifi-app-order-sets-list',
  providers: [provideResourceManager(CrudOrderSets)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    RouterLink,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
  ],
  templateUrl: './order-sets-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for clinical order sets */
export class OrderSetsList {
  private resourceManager = inject<ResourceManager<orderSet>>(ResourceManager);
  private crud = inject(CrudOrderSets);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = orderSetColumns;
  filters = orderSetFilters;
  data = this.resourceManager.data;

  /** Deletes an order set after confirmation */
  delete(id: string) {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.resourceManager.data.reload();
        },
      });
  }

  /** Navigates to the order set edit form */
  gotoEdit = (element: orderSet) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
