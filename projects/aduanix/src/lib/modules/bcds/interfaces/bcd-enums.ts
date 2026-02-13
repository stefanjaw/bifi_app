export type ValuationMethodType = '001' | '002';

export type EBCDType =
  | 'SENT_CSV'
  | 'FILE_ERROR_CSV'
  | 'FORMAT_ERROR_PDF'
  | 'FORMAT_ERROR_TXT'
  | 'RELEASE_CSV'
  | 'RELEASE_PDF'
  | 'RELEASE_TXT'
  | 'RECEIPT_TXT';

export type BCDStatusType = 'DRAFT' | 'PENDING_RESPONSE' | 'FAILED' | 'PENDING_QUERY' | 'SUBMITTED';
