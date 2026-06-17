import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudPurchaseOrders } from '../../services/crud-purchase-orders';
import { purchaseOrderColumns } from '../../libraries/purchase-order-columns';
import { purchaseOrderFilters } from '../../libraries/purchase-order-filters';
import { purchaseOrder } from '../../interfaces/purchase-order';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-purchase-orders',
  providers: [provideResourceManager(CrudPurchaseOrders)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink, ButtonsActions],
  templateUrl: './purchase-orders.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseOrders {
  private resourceManager = inject<ResourceManager<purchaseOrder>>(ResourceManager);
  private crudPurchaseOrders = inject(CrudPurchaseOrders);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);

  purchaseOrderColumns = purchaseOrderColumns;
  purchaseOrderFilters = purchaseOrderFilters;

  entries = this.resourceManager.data;

  onClickRow = (row: purchaseOrder) => {
    this.router.navigate(['/purchases/orders', row._id]);
  };

  deleteEntry(id: string) {
    this.crudPurchaseOrders
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.entries.reload();
        },
      });
  }
}
