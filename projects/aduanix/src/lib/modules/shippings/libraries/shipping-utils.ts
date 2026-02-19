import { Tag } from 'primeng/tag';
import { invoice, shipping } from '../interfaces/shipping';

/**
 * Returns the tag config for the given BCD status.
 * @param {shipping['status']} status - The status of the BCD.
 * @returns {Object} - The tag config.
 * @example
 * const status = 'PDF_PROCESSED';
 * const tagConfig = this.getBCDStatusConfig(status);
 * console.log(tagConfig); // { value: 'PDF Processed', severity: 'success' }
 */
export function getShippingStatusConfig(status: shipping['status']): {
  value: string;
  severity: Tag['severity'];
} {
  switch (status) {
    case 'PDF_PROCESSED':
      return {
        value: 'PDF Processed',
        severity: 'success',
      };
    case 'ERROR':
      return {
        value: 'Error',
        severity: 'danger',
      };
    case 'UPLOADING':
      return {
        value: 'Uploading',
        severity: 'info',
      };
    case 'BCD_SENT':
      return {
        value: 'BCD Sent',
        severity: 'success',
      };
    default: {
      return {
        value: 'Unknown',
        severity: 'warn',
      };
    }
  }
}

/**
 * Returns the tag config for the given invoice status.
 * @param {string} status - The status of the invoice.
 * @returns {Object} - The tag config.
 * @example
 * const status = 'PROCESSING_PDF';
 * const tagConfig = this.getInvoiceStatusTagConfig(status);
 * console.log(tagConfig); // { severity: 'warn', value: 'Processing PDF' }
 */
export function getInvoiceStatusTagConfig(status: invoice['status']): {
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
