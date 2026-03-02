import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudSalesOrders } from '../../services/crud-sales-orders';
import { salesOrder } from '../../interfaces/sales-order';
import { salesOrderColumns } from '../../libraries/sales-order-columns';
import { salesOrderFilters } from '../../libraries/sales-order-filters';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-orders-list',
  providers: [provideResourceManager(CrudSalesOrders)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule],
  templateUrl: './orders-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersList {
  private resourceManager = inject<ResourceManager<salesOrder>>(ResourceManager);
  private crudSalesOrders = inject(CrudSalesOrders);
  private destroy$ = inject(DestroyRef);

  salesOrderColumns = salesOrderColumns;
  salesOrderFilters = salesOrderFilters;

  entries = this.resourceManager.data;

  deleteEntry(id: string) {
    this.crudSalesOrders
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.entries.reload();
        },
      });
  }
}
