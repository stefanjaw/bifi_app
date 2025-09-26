import { filter } from '@avalantec/base-app/resource';
import { contact } from '../interfaces/contacts';

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
  }
];
