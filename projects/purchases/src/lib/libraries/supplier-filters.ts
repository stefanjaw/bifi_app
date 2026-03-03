import { filter } from '@avalantec/base-app/resource';
import { supplier } from '../interfaces/supplier';

export const supplierFilters: filter<supplier>[] = [
  {
    field: 'fullName',
    type: 'string',
  },
  {
    field: 'email',
    type: 'string',
  },
  {
    field: 'phoneNumber',
    type: 'string',
  },
];
