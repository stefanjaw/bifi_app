import { filter } from 'projects/base-app/src/public-api';
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
