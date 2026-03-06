import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudPaymentTerms } from '../../services/crud-payment-terms';
import { paymentTerm } from '../../interfaces/payment-term';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
  tableColumn,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

const paymentTermColumns: tableColumn<paymentTerm>[] = [
  { field: 'name', title: 'Name', type: 'text', sortable: true },
  { field: 'active', title: 'Active', type: 'text' },
];

@Component({
  selector: 'bifi-app-payment-terms-list',
  providers: [provideResourceManager(CrudPaymentTerms)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink],
  templateUrl: './payment-terms-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentTermsList {
  private resourceManager = inject<ResourceManager<paymentTerm>>(ResourceManager);
  private crudPaymentTerms = inject(CrudPaymentTerms);
  private destroy$ = inject(DestroyRef);

  columns = paymentTermColumns;
  paymentTerms = this.resourceManager.data;

  delete(id: string) {
    this.crudPaymentTerms
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: res => { if (res) this.paymentTerms.reload(); } });
  }
}
