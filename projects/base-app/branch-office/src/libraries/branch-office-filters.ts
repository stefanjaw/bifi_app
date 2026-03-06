import { filter } from '@avalantec/base-app/resource';
import { branchOffice } from '../interfaces/branch-office';

export const branchOfficeFilters: filter<branchOffice>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'branchCode',
    type: 'string',
  },
  {
    field: 'address',
    type: 'string',
  },
];
