import { tableColumn } from '@avalantec/base-app/resource';
import { exchangeRate } from '../interfaces/exchange-rate';

export const exchangeRateColumns: tableColumn<exchangeRate>[] = [
  {
    field: 'fromCurrencyId.code',
    title: 'From',
    type: 'text',
  },
  {
    field: 'toCurrencyId.code',
    title: 'To',
    type: 'text',
  },
  {
    field: 'rate',
    title: 'Rate',
    type: 'number',
    sortable: true,
  },
  {
    field: 'effectiveDate',
    title: 'Effective Date',
    type: 'date',
    sortable: true,
  },
];
