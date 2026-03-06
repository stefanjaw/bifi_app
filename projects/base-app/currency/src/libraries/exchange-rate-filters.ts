import { filter } from '@avalantec/base-app/resource';
import { exchangeRate } from '../interfaces/exchange-rate';

export const exchangeRateFilters: filter<exchangeRate>[] = [
  {
    field: 'fromCurrencyId.code',
    type: 'string',
  },
  {
    field: 'toCurrencyId.code',
    type: 'string',
  },
];
