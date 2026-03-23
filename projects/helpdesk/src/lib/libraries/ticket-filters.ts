import { filter } from '@avalantec/base-app/resource';
import { ticket } from '../interfaces/ticket';

export const ticketFilters: filter<ticket>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'priority',
    type: 'string',
  },
  {
    field: 'category',
    type: 'string',
  },
  {
    field: 'appModule',
    type: 'string',
  },
];
