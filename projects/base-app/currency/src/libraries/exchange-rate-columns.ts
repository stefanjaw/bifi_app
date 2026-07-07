import { tableColumn } from '@avalantec/base-app/resource';
import { exchangeRate } from '../interfaces/exchange-rate';

export const exchangeRateColumns: tableColumn<exchangeRate>[] = [
  {
    field: 'fromCurrencyId.code',
    title: 'from',
    type: 'text',
  },
  {
    field: 'toCurrencyId.code',
    title: 'to',
    type: 'text',
  },
  {
    field: 'rate',
    title: 'rate',
    type: 'number',
    sortable: true,
  },
  {
    field: 'effectiveDate',
    title: 'effectiveDate',
    type: 'date',
    sortable: true,
  },
];
