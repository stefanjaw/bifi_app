import { company } from '@avalantec/base-app/interfaces';
import { filter } from '@avalantec/base-app/resource';

export const companyFilters: filter<company>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'address',
    type: 'string',
  },
  {
    field: 'countryId.name',
    type: 'string',
  },
  {
    field: 'contactId.name',
    type: 'string',
  },
];
