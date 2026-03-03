import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudPurchaseOrders } from '../../services/crud-purchase-orders';
import { purchaseOrderColumns } from '../../libraries/purchase-order-columns';
import { purchaseOrderFilters } from '../../libraries/purchase-order-filters';
import { purchaseOrder, purchaseOrderStatus } from '../../interfaces/purchase-order';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { HasPermission } from '@avalantec/base-app/auth';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-purchase-orders',
  providers: [provideResourceManager(CrudPurchaseOrders)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, SearchBar, ButtonModule, TagModule, HasPermission, RouterLink],
  templateUrl: './purchase-orders.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseOrders {
  private resourceManager = inject<ResourceManager<purchaseOrder>>(ResourceManager);
  private crudPurchaseOrders = inject(CrudPurchaseOrders);
  private destroy$ = inject(DestroyRef);

  purchaseOrderColumns = purchaseOrderColumns;
  purchaseOrderFilters = purchaseOrderFilters;

  entries = this.resourceManager.data;

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      draft: 'secondary',
      sent: 'info',
      partially_received: 'warn',
      received: 'success',
      cancelled: 'danger',
    };
    return map[status] ?? 'secondary';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      draft: 'Draft',
      sent: 'Sent',
      partially_received: 'Partially Received',
      received: 'Received',
      cancelled: 'Cancelled',
    };
    return map[status] ?? status;
  }

  cancelOrder(id: string) {
    this.crudPurchaseOrders
      .updateStatus(id, 'cancelled')
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => this.entries.reload(),
      });
  }
}
