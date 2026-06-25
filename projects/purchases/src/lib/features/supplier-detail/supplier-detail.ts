import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudPurchaseOrders } from '../../services/crud-purchase-orders';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { purchaseOrder } from '../../interfaces/purchase-order';
import { contact } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-supplier-detail',
  imports: [
    RouterLink,
    ButtonModule,
    TagModule,
    CardModule,
    ProgressBarModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './supplier-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierDetail {
  private crudContacts = inject(CrudContacts);
  private crudPurchaseOrders = inject(CrudPurchaseOrders);

  id = input<string>('');

  contactResource = this.crudContacts.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  ordersResource = this.crudPurchaseOrders.get({
    searchParams: computed(() => (this.id() ? { contactId: this.id() } : {})),
    triggerRequest: computed(() => !!this.id()),
    getInactive: null,
  });

  supplier = computed(() => this.contactResource.value() as contact | null);
  orders = computed(() => this.ordersResource.value() as purchaseOrder[]);
  isLoading = computed(() => this.contactResource.isLoading() || this.ordersResource.isLoading());

  totalSpent = computed(() => {
    const orderList = this.orders();
    if (!orderList || !Array.isArray(orderList)) return 0;
    return orderList
      .filter(o => o.status === 'received' || o.status === 'partially_received')
      .reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  });

  outstandingBalance = computed(() => {
    const orderList = this.orders();
    if (!orderList || !Array.isArray(orderList)) return 0;
    return orderList
      .filter(o => o.status === 'draft' || o.status === 'sent' || o.status === 'partially_received')
      .reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  });

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
}
