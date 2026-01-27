import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  FileResolver,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudShippings } from '../../services/crud-shippings';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { RouterLink } from '@angular/router';
import { invoice, shipping } from '../../interfaces/shipping';
// import { shippingColumns } from '../../libraries/shipping-columns';
import { shippingFilters } from '../../libraries/shipping-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { shippingColumns } from '../../libraries/shipping-columns';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ShippingFileFormDialog } from '../shipping-file-form-dialog/shipping-file-form-dialog';
import { Tag } from 'primeng/tag';
import { CrudBCD } from '@avalantec/aduanix/modules/bcds/services/crud-bcd';
import { bcd } from '@avalantec/aduanix/modules/bcds/interfaces/bcd';
// import { BCDFormManager } from '@avalantec/aduanix/modules/bcds/services/bcd-form-manager';

@Component({
  selector: 'bifi-app-shippings-list',
  providers: [provideResourceManager(CrudShippings)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [
    SearchBar,
    ButtonModule,
    HasPermission,
    RouterLink,
    TableModule,
    TableLayout,
    CommonModule,
    AccordionModule,
    ShippingFileFormDialog,
    Tag,
  ],
  templateUrl: './shippings-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingsList {
  private resourceManager = inject<ResourceManager<shipping>>(ResourceManager);
  private crudShippings = inject(CrudShippings);
  // private crudBCD = inject(CrudBCD);
  private destroy$ = inject(DestroyRef);
  // private bcdFormManager = inject(BCDFormManager);
  protected fileResolver = inject(FileResolver);

  shippingColumns = shippingColumns;
  shippingFilters = shippingFilters;

  shippings = this.resourceManager.data;

  deleteShipping(id: string) {
    this.crudShippings
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.shippings.reload();
        },
      });
  }

  /**
   * Returns the tag config for the given invoice status.
   * @param {string} status - The status of the invoice.
   * @returns {Object} - The tag config.
   * @example
   * const status = 'PROCESSING_PDF';
   * const tagConfig = this.getInvoiceStatusTagConfig(status);
   * console.log(tagConfig); // { severity: 'warning', value: 'Processing PDF' }
   */
  getInvoiceStatusTagConfig(status: invoice['status']): {
    value: string;
    severity: Tag['severity'];
  } {
    switch (status) {
      case 'PROCESSING_PDF':
        return {
          severity: 'warn',
          value: 'Processing PDF',
        };
      case 'ERROR_JSON':
        return {
          severity: 'danger',
          value: 'Error JSON',
        };
      case 'DATA_PROCESSED':
        return {
          severity: 'success',
          value: 'Data Processed',
        };
      case 'COMPLETE':
        return {
          severity: 'success',
          value: 'Complete',
        };
    }
  }
}
