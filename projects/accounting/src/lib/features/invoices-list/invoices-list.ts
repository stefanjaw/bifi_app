import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudInvoices } from '../../services/crud-invoices';
import { invoice } from '../../interfaces/invoice';
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
import { invoiceColumns } from '../../libraries/invoice-columns';
import { invoiceFilters } from '../../libraries/invoice-filters';

@Component({
  selector: 'bifi-app-invoices-list',
  providers: [provideResourceManager(CrudInvoices)],
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TableLayout, SearchBar, ButtonModule, HasPermission, RouterLink],
  templateUrl: './invoices-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesList {
  private resourceManager = inject<ResourceManager<invoice>>(ResourceManager);
  private crudInvoices = inject(CrudInvoices);
  private destroy$ = inject(DestroyRef);

  columns = invoiceColumns;
  filters = invoiceFilters;
  invoices = this.resourceManager.data;

  delete(id: string) {
    this.crudInvoices
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({ next: res => { if (res) this.invoices.reload(); } });
  }
}
