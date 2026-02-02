export type BCDType = 'I' | 'E' | 'D' | 'A';

export type AdditionalInformationType = 'TXT' | 'INV' | 'SUP';

export type ValuationMethodType = '01' | '02';

export type TaxType = 'CUD' | 'WHA' | 'WSF';

export type TaxIdType = 'F' | 'E';

export type ChargeCodeType = '212' | '641' | '640';

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
