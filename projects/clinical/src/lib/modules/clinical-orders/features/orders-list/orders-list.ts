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
import { CrudOrders } from '../../services/crud-orders';
import { orderColumns } from '../../routes/clinical-orders-columns';
import { orderFilters } from '../../routes/clinical-orders-filters';
import { order } from '../../interfaces/clinical-orders';
import { OrderFormDialog } from '../order-form-dialog/order-form-dialog';

/** List component for clinical orders */
@Component({
  selector: 'bifi-app-orders-list',
  providers: [provideResourceManager(CrudOrders)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    OrderFormDialog,
  ],
  templateUrl: './orders-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersList {
  private resourceManager = inject<ResourceManager<order>>(ResourceManager);
  private crud = inject(CrudOrders);
  private destroy$ = inject(DestroyRef);

  columns = orderColumns;
  filters = orderFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(OrderFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: order): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes an order after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
