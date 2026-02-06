import {
  ValuationMethodType,
  TaxIdType,
  TaxType,
  ChargeCodeType,
} from '../interfaces/bcd-types';

export const valuationMethodTypeOptions: { value: ValuationMethodType; label: string }[] = [
  { value: '01', label: 'Transactional Value' },
  { value: '02', label: 'Identical / Similar goods' },
];

export const taxIdTypeOptions: { value: TaxIdType; label: string }[] = [
  { value: 'F', label: 'Full Rate' },
  { value: 'H', label: 'Higher Rate' },
  { value: 'D', label: 'Deposit Rate' },
  { value: 'E', label: 'Exempt Rate' },
  { value: 'S', label: 'Suspended Rate' },
  { value: 'C', label: 'Concessional Rate' },
];

export const taxTypeOptions: { value: TaxType; label: string }[] = [
  { value: 'CUD', label: 'Customs' },
  { value: 'WHA', label: 'Wharfage' },
  { value: 'WSF', label: 'Warehouse' },
  { value: 'DEP', label: 'Deposit' },
];

export const chargeCodeTypeOptions: { value: ChargeCodeType; label: string }[] = [
  { value: '212', label: 'Cash Discount' },
  { value: '641', label: 'Freight Additional' },
  { value: '640', label: 'Freight Stat' },
];
