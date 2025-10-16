import { country } from '@avalantec/base-app/interfaces';
import { filter } from '@avalantec/base-app/resource';

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
