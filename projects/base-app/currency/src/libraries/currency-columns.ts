import { tableColumn } from '@avalantec/base-app/resource';
import { currency } from '../interfaces/currency';

export const currencyColumns: tableColumn<currency>[] = [
  {
    field: 'name',
    title: 'Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'code',
    title: 'Code',
    type: 'text',
    sortable: true,
  },
  {
    field: 'symbol',
    title: 'Symbol',
    type: 'text',
  },
  {
    field: 'decimalPrecision',
    title: 'Decimals',
    type: 'number',
  },
];
