import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
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
import { shippingFilters } from '../../libraries/shipping-filters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { shippingColumns } from '../../libraries/shipping-columns';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ShippingFileFormDialog } from '../shipping-file-form-dialog/shipping-file-form-dialog';
import { Tag } from 'primeng/tag';
import { bcd, CrudBCD, ebcdSchema, getBCDFileTypeConfig, getBCDStatusConfig } from '../../../bcds';
import { getInvoiceStatusTagConfig, getShippingStatusConfig } from '../../libraries/shipping-utils';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

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
    TranslatePipe,
  ],
  templateUrl: './shippings-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingsList {
  private resourceManager = inject<ResourceManager<shipping>>(ResourceManager);
  private crudShippings = inject(CrudShippings);
  private crudBCD = inject(CrudBCD);
  private destroy$ = inject(DestroyRef);
  protected fileResolver = inject(FileResolver);
  private translationService = inject(TranslationService);

  shippingFilters = shippingFilters;

  shippingColumns = computed(() =>
    shippingColumns.map(col => {
      if (col.field === 'status') {
        const originalComponent = col.component!;
        return {
          ...col,
          component: (value: shipping) => {
            const bcdStatus = value.bcds?.length
              ? getBCDStatusConfig(value.bcds[value.bcds.length - 1].status)
              : undefined;
            const shippingStatus = getShippingStatusConfig(value.status);
            const displayValue = bcdStatus
              ? `${this.translationService.translate(bcdStatus.value, {}, 'aduanix')} (${this.translationService.translate(shippingStatus.value, {}, 'aduanix')})`
              : this.translationService.translate(shippingStatus.value, {}, 'aduanix');
            return {
              component: Tag,
              inputs: {
                value: displayValue,
                severity: bcdStatus?.severity || shippingStatus.severity,
              },
              outputs: {},
            };
          },
        };
      }
      return col;
    })
  );

  shippings = this.resourceManager.data;
  isUploadFTPLoading = signal(false);

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
    this.isUploadFTPLoading.set(true);

    this.crudBCD
      .updateBCDsFromFTP()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.shippings.reload();
          this.isUploadFTPLoading.set(false);
        },
        error: () => {
          this.isUploadFTPLoading.set(false);
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
  getInvoiceStatusTagConfig(status: invoice['status']) {
    return getInvoiceStatusTagConfig(status);
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
  getBCDStatusConfig(status: bcd['status']) {
    return getBCDStatusConfig(status);
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
  getBCDFileTypeConfig(type: ebcdSchema['type']) {
    return getBCDFileTypeConfig(type);
  }

  /**
   * Returns the name of the first SENT_CSV EBCD document in the given BCD.
   * If no SENT_CSV EBCD document is found, 'No name provided' is returned.
   * @param {BCD} bcd - The BCD document to get the name from.
   * @returns {string} - The name of the first SENT_CSV EBCD document in the given BCD.
   */
  getBCDName(bcd: bcd) {
    return (
      bcd.ebcds.find(ebcd => ebcd.type === 'SENT_CSV')?.file.name ||
      this.translationService.translate('fallback.notUploaded', {}, 'aduanix')
    );
  }
}
