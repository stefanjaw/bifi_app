import { contact } from '@avalantec/base-app/core';
import { filter } from '@avalantec/base-app/resource';

export const contactFilters: filter<contact>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'lastName',
    type: 'string',
  },
  {
    field: 'phoneNumber',
    type: 'string',
  },
  {
    field: 'email',
    type: 'string',
  },
  {
    field: 'parentId.name',
    type: 'string',
  },
  {
    field: 'type',
    type: 'string',
  },
];
