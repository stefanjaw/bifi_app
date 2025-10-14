import { filter } from '@avalantec/base-app/resource';
import { country } from '../interfaces/country';

export const countryFilters: filter<country>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'code',
    type: 'string',
  },
  {
    field: 'currencyCode',
    type: 'string',
  },
  {
    field: 'currencySymbol',
    type: 'string',
  },
];
