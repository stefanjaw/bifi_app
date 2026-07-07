import { tableColumn } from '@avalantec/base-app/resource';
import { currency } from '../interfaces/currency';

export const currencyColumns: tableColumn<currency>[] = [
  {
    field: 'name',
    title: 'name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'code',
    title: 'code',
    type: 'text',
    sortable: true,
  },
  {
    field: 'symbol',
    title: 'symbol',
    type: 'text',
  },
  {
    field: 'decimalPrecision',
    title: 'decimals',
    type: 'number',
  },
];
