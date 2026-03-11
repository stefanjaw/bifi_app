import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudPayments } from '../../services/crud-payments';
import { payment } from '../../interfaces/payment';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { paymentColumns } from '../../libraries/payment-columns';
import { paymentFilters } from '../../libraries/payment-filters';

@Component({
  selector: 'bifi-app-payments-list',
  providers: [provideResourceManager(CrudPayments)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink],
  templateUrl: './payments-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsList {
  private resourceManager = inject<ResourceManager<payment>>(ResourceManager);
  private crudPayments = inject(CrudPayments);
  private destroy$ = inject(DestroyRef);

  columns = paymentColumns;
  filters = paymentFilters;
  payments = this.resourceManager.data;

  delete(id: string) {
    this.crudPayments
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: res => { if (res) this.payments.reload(); } });
  }
}
