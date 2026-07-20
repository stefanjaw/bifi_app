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
import { CrudOrderSets } from '../../services/crud-order-sets';
import { orderSetColumns } from '../../routes/clinical-orders-columns';
import { orderSetFilters } from '../../routes/clinical-orders-filters';
import { orderSet } from '../../interfaces/clinical-orders';
import { OrderSetFormDialog } from '../order-set-form-dialog/order-set-form-dialog';

/** List component for clinical order sets */
@Component({
  selector: 'bifi-app-order-sets-list',
  providers: [provideResourceManager(CrudOrderSets)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [
    TableLayout,
    SearchBar,
    ButtonModule,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
    OrderSetFormDialog,
  ],
  templateUrl: './order-sets-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSetsList {
  private resourceManager = inject<ResourceManager<orderSet>>(ResourceManager);
  private crud = inject(CrudOrderSets);
  private destroy$ = inject(DestroyRef);

  columns = orderSetColumns;
  filters = orderSetFilters;
  data = this.resourceManager.data;
  formDialog = viewChild.required(OrderSetFormDialog);

  addNew(): void {
    this.formDialog().open();
  }

  gotoEdit = (element: orderSet): void => {
    this.formDialog().open(element);
  };

  onSaved(): void {
    this.data.reload();
  }

  /** Deletes an order set after confirmation */
  delete(id: string): void {
    this.crud
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: () => this.data.reload() });
  }
}
