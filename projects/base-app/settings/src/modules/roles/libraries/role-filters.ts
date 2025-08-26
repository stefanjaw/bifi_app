import { role } from '@avalantec/base-app/core';
import { filter } from '@avalantec/base-app/resource';

export const roleFilters: filter<role>[] = [
  {
    field: 'name',
    type: 'string',
  },
];
