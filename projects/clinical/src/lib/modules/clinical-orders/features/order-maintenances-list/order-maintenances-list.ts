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
import { CrudOrderMaintenances } from '../../services/crud-order-maintenances';
import { orderMaintenanceColumns } from '../../routes/clinical-orders-columns';
import { orderMaintenanceFilters } from '../../routes/clinical-orders-filters';
import { orderMaintenance } from '../../interfaces/clinical-orders';

@Component({
  selector: 'bifi-app-order-maintenances-list',
  providers: [provideResourceManager(CrudOrderMaintenances)],
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
  templateUrl: './order-maintenances-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** List component for order maintenance types */
export class OrderMaintenancesList {
  private resourceManager = inject<ResourceManager<orderMaintenance>>(ResourceManager);
  private crud = inject(CrudOrderMaintenances);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = orderMaintenanceColumns;
  filters = orderMaintenanceFilters;
  data = this.resourceManager.data;

  /** Deletes an order maintenance type after confirmation */
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

  /** Navigates to the order maintenance edit form */
  gotoEdit = (element: orderMaintenance) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
}
