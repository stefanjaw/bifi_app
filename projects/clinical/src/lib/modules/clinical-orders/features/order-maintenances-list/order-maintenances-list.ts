import { Component, ChangeDetectionStrategy, inject, DestroyRef, viewChild } from '@angular/core';
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
import { OrderMaintenanceFormDialog } from '../order-maintenance-form-dialog/order-maintenance-form-dialog';

/** List component for order maintenance types */
@Component({
  selector: 'bifi-app-order-maintenances-list',
  providers: [provideResourceManager(CrudOrderMaintenances)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    OrderMaintenanceFormDialog,
  ],
  templateUrl: './order-maintenances-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderMaintenancesList {
  private resourceManager = inject<ResourceManager<orderMaintenance>>(ResourceManager);
  private crud = inject(CrudOrderMaintenances);
  private destroy$ = inject(DestroyRef);

  columns = orderMaintenanceColumns;
  filters = orderMaintenanceFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(OrderMaintenanceFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: orderMaintenance): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes an order maintenance type after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
