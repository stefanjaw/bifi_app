import { Tag } from 'primeng/tag';
import { bcd, ebcdSchema } from '../../bcds';

/**
 * Returns the tag config for the given BCD status.
 * @param {string} status - The status of the BCD.
 * @returns {Object} - The tag config.
 * @example
 * const status = 'DRAFT';
 * const tagConfig = this.getBCDStatusTagConfig(status);
 * console.log(tagConfig); // { severity: 'info', value: 'Draft' }
 */
export function getBCDStatusConfig(status: bcd['status']): {
  value: string;
  severity: Tag['severity'];
} {
  switch (status) {
    case 'DRAFT':
      return {
        value: 'status.bcd.draft',
        severity: 'info',
      };
    case 'FAILED':
      return {
        value: 'status.bcd.failed',
        severity: 'danger',
      };
    case 'PENDING_QUERY':
      return {
        value: 'status.bcd.pendingQuery',
        severity: 'warn',
      };
    case 'PENDING_RESPONSE':
      return {
        value: 'status.bcd.pendingResponse',
        severity: 'warn',
      };
    case 'SUBMITTED':
      return {
        value: 'status.bcd.submitted',
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
export function getBCDFileTypeConfig(type: ebcdSchema['type']): {
  value: string;
  severity: Tag['severity'];
} {
  switch (type) {
    case 'FILE_ERROR_CSV':
      return {
        value: 'status.ebcd.fileErrorCsv',
        severity: 'danger',
      };
    case 'FORMAT_ERROR_PDF':
      return {
        value: 'status.ebcd.formatErrorPdf',
        severity: 'danger',
      };
    case 'FORMAT_ERROR_TXT':
      return {
        value: 'status.ebcd.formatErrorTxt',
        severity: 'danger',
      };
    case 'RECEIPT_TXT':
      return {
        value: 'status.ebcd.receiptTxt',
        severity: 'success',
      };
    case 'RELEASE_CSV':
      return {
        value: 'status.ebcd.releaseCsv',
        severity: 'success',
      };
    case 'RELEASE_PDF':
      return {
        value: 'status.ebcd.releasePdf',
        severity: 'success',
      };
    case 'RELEASE_TXT':
      return {
        value: 'status.ebcd.releaseTxt',
        severity: 'success',
      };
    case 'SENT_CSV':
      return {
        value: 'status.ebcd.sentCsv',
        severity: 'success',
      };
  }
}
