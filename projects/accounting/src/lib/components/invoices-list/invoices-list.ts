import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudInvoices } from '../../services/crud-invoices';
import { invoice } from '../../interfaces/invoice';
import {
  provideResourceManager,
  ResourceManager,
  TableLayout,
  tableColumn,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

const invoiceColumns: tableColumn<invoice>[] = [
  { field: 'number', title: 'Number', type: 'text' },
  { field: 'contactId.name', title: 'Contact', type: 'text' },
  { field: 'invoiceDate', title: 'Invoice Date', type: 'date' },
  { field: 'dueDate', title: 'Due Date', type: 'date' },
  { field: 'journalId.name', title: 'Journal', type: 'text' },
  { field: 'totalAmount', title: 'Total', type: 'currency' },
  { field: 'amountDue', title: 'Amount Due', type: 'currency' },
  { field: 'state', title: 'Status', type: 'text' },
  { field: 'currencyId.code', title: 'Currency', type: 'text' },
];

@Component({
  selector: 'bifi-app-invoices-list',
  providers: [provideResourceManager(CrudInvoices)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, ButtonModule, HasPermission, RouterLink],
  templateUrl: './invoices-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesList {
  private resourceManager = inject<ResourceManager<invoice>>(ResourceManager);
  private crudInvoices = inject(CrudInvoices);
  private destroy$ = inject(DestroyRef);

  columns = invoiceColumns;
  invoices = this.resourceManager.data;

  delete(id: string) {
    this.crudInvoices
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: res => { if (res) this.invoices.reload(); } });
  }
}
