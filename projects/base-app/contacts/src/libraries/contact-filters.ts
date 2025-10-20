import { contact } from '@avalantec/base-app/interfaces';
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
    field: 'website',
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
  {
    field: 'countryId.name',
    type: 'string',
  },
  {
    field: 'state',
    type: 'string',
  },
  {
    field: 'city',
    type: 'string',
  },
  {
    field: 'zipCode',
    type: 'string',
  },
  {
    field: 'streetAddress',
    type: 'string',
  },
  {
    field: 'streetAddress2',
    type: 'string',
  },
];
