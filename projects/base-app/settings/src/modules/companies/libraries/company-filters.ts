import { filter } from '@avalantec/base-app/resource';
import { company } from '../interfaces/company';

export const companyFilters: filter<company>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'address',
    type: 'string',
  },
];
