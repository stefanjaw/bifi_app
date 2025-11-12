import { policy } from '@avalantec/base-app/interfaces';
import { filter } from '@avalantec/base-app/resource';

export const policyFilters: filter<policy<string, string>>[] = [
  {
    field: 'resource',
    type: 'string',
  },
  {
    field: 'name',
    type: 'string',
  },
];
