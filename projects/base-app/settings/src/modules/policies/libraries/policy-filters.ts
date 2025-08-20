import { policy } from '@avalantec/base-app/core';
import { filter } from '@avalantec/base-app/resource';

export const policyFilters: filter<policy<string, string>>[] = [
  {
    field: 'resource',
    type: 'string',
  },
  {
    field: 'action',
    type: 'string',
  },
];
