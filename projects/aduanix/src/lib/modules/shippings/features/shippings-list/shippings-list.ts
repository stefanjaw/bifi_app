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
import { bcd, CrudBCD, ebcdSchema } from '../../../bcds';
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
  private crudBCD = inject(CrudBCD);
  private destroy$ = inject(DestroyRef);
  // private bcdFormManager = inject(BCDFormManager);
  protected fileResolver = inject(FileResolver);

  shippingColumns = shippingColumns;
  shippingFilters = shippingFilters;

  shippings = this.resourceManager.data;

  /**
   * Deletes a shipping document with the given id.
   * If the deletion is successful, the shippings list will be reloaded.
   * @param {string} id - The id of the shipping document to be deleted.
   */
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
   * Updates the BCDs from the FTP server.
   * This function will trigger the reload of the shipments list if the update is successful.
   */
  updateFromFTP() {
    this.crudBCD
      .updateBCDsFromFTP()
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

  /**
   * Returns the tag config for the given BCD status.
   * @param {string} status - The status of the BCD.
   * @returns {Object} - The tag config.
   * @example
   * const status = 'DRAFT';
   * const tagConfig = this.getBCDStatusTagConfig(status);
   * console.log(tagConfig); // { severity: 'info', value: 'Draft' }
   */
  getBCDStatusConfig(status: bcd['status']): { value: string; severity: Tag['severity'] } {
    switch (status) {
      case 'DRAFT':
        return {
          value: 'Draft',
          severity: 'info',
        };
      case 'FAILED':
        return {
          value: 'Failed',
          severity: 'danger',
        };
      case 'PENDING_QUERY':
        return {
          value: 'Pending Query',
          severity: 'warn',
        };
      case 'PENDING_RESPONSE':
        return {
          value: 'Pending Response',
          severity: 'warn',
        };
      case 'SUBMITTED':
        return {
          value: 'Submitted',
          severity: 'success',
        };
    }
  }

  /**
   * Returns the tag config for the given EBCD type.
   * @param {string} type - The type of the EBCD.
   * @returns {Object} - The tag config.
   * @example
   * const type = 'FILE_ERROR_CSV';
   * const tagConfig = this.getBCDFileType(type);
   * console.log(tagConfig); // { value: 'File Error CSV', severity: 'danger' }
   */
  getBCDFileTypeConfig(type: ebcdSchema['type']): { value: string; severity: Tag['severity'] } {
    switch (type) {
      case 'FILE_ERROR_CSV':
        return {
          value: 'File Error CSV',
          severity: 'danger',
        };
      case 'FORMAT_ERROR_PDF':
        return {
          value: 'Format Error PDF',
          severity: 'danger',
        };
      case 'FORMAT_ERROR_TXT':
        return {
          value: 'Format Error TXT',
          severity: 'danger',
        };
      case 'RECEIPT_TXT':
        return {
          value: 'Receipt TXT',
          severity: 'success',
        };
      case 'RELEASE_CSV':
        return {
          value: 'Release CSV',
          severity: 'success',
        };
      case 'RELEASE_PDF':
        return {
          value: 'Release PDF',
          severity: 'success',
        };
      case 'RELEASE_TXT':
        return {
          value: 'Release TXT',
          severity: 'success',
        };
      case 'SENT_CSV':
        return {
          value: 'Sent CSV',
          severity: 'success',
        };
    }
  }

  /**
   * Returns the name of the first SENT_CSV EBCD document in the given BCD.
   * If no SENT_CSV EBCD document is found, 'No name provided' is returned.
   * @param {BCD} bcd - The BCD document to get the name from.
   * @returns {string} - The name of the first SENT_CSV EBCD document in the given BCD.
   */
  getBCDName(bcd: bcd) {
    return bcd.ebcds.find(ebcd => ebcd.type === 'SENT_CSV')?.file.name || 'Not uploaded';
  }
}
