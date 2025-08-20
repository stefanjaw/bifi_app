import { user } from '@avalantec/base-app/core';
import { filter } from '@avalantec/base-app/resource';

export const userFilters: filter<user>[] = [
  {
    field: 'username',
    type: 'string',
  },
  {
    field: 'email',
    type: 'string',
  },
  {
    field: 'provider',
    type: 'string',
  },
];
