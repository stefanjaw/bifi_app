import { filter } from '@avalantec/base-app/resource';
import { account } from '../interfaces/account';

export const accountFilters: filter<account>[] = [
  { field: 'code', operator: 'like', type: 'string' },
  { field: 'name', operator: 'like', type: 'string' },
];
