import { filter } from '@avalantec/base-app/resource';
import { crm } from '../interfaces/crm';

export const crmFilters: filter<crm>[] = [
  {
    field: 'title',
    type: 'string',
  },
  {
    field: 'company.name',
    type: 'string',
  },
  {
    field: 'contact.name',
    type: 'string',
  },
  {
    field: 'stage',
    type: 'string',
  },
];
