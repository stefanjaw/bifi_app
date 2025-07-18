import { filter } from '@avalantec/base-app/system';
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
];
