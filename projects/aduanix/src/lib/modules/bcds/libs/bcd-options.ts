import { ValuationMethodType } from '../interfaces/bcd-enums';

export const valuationMethodTypeOptions: { value: ValuationMethodType; label: string }[] = [
  { value: '01', label: 'option.valuationMethod.transactionalValue' },
  { value: '02', label: 'option.valuationMethod.identicalSimilarGoods' },
];
