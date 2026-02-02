import {
  AdditionalInformationType,
  BCDType,
  ValuationMethodType,
  TaxIdType,
  TaxType,
  ChargeCodeType,
} from '../interfaces/bcd-types';

export const bcdTypeOptions: { value: BCDType; label: string }[] = [
  { value: 'I', label: 'Import' },
  { value: 'E', label: 'Export' },
  { value: 'D', label: 'D' },
  { value: 'A', label: 'A' },
];

export const additionalInformationTypeOptions: {
  value: AdditionalInformationType;
  label: string;
}[] = [
  { value: 'INV', label: 'Invoice' },
  { value: 'TXT', label: 'Text' },
  { value: 'SUP', label: 'Supplier' },
];

export const valuationMethodTypeOptions: { value: ValuationMethodType; label: string }[] = [
  { value: '01', label: 'Transactional Value' },
  { value: '02', label: 'Other' },
];

export const taxIdTypeOptions: { value: TaxIdType; label: string }[] = [
  { value: 'F', label: 'Full Rate' },
  { value: 'E', label: 'Exchange Rate' },
];

export const taxTypeOptions: { value: TaxType; label: string }[] = [
  { value: 'CUD', label: 'Customs' },
  { value: 'WHA', label: 'Wharfage' },
  { value: 'WSF', label: 'Warehouse' },
];

export const chargeCodeTypeOptions: { value: ChargeCodeType; label: string }[] = [
  { value: '212', label: 'Cash Discount' },
  { value: '641', label: 'Freight Additional' },
  { value: '640', label: 'Freight Stat' },
];
