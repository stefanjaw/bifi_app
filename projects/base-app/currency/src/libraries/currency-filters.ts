import { filter } from '@avalantec/base-app/resource';
import { currency } from '../interfaces/currency';

export const currencyFilters: filter<currency>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'code',
    type: 'string',
  },
  {
    field: 'symbol',
    type: 'string',
  },
];
