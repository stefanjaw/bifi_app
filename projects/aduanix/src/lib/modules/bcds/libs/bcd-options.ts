import {
  ValuationMethodType,
  ChargeCodeType,
} from '../interfaces/bcd-enums';

export const valuationMethodTypeOptions: { value: ValuationMethodType; label: string }[] = [
  { value: '01', label: 'Transactional Value' },
  { value: '02', label: 'Identical / Similar goods' },
];

export const chargeCodeTypeOptions: { value: ChargeCodeType; label: string }[] = [
  { value: '212', label: 'Cash Discount' },
  { value: '641', label: 'Freight Additional' },
  { value: '640', label: 'Freight Stat' },
];
