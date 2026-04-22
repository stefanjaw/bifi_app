import { filter } from '@avalantec/base-app/resource';
import { salesOrder } from '../interfaces/sales-order';

export const salesOrderFilters: filter<salesOrder>[] = [
  {
    field: 'crmId.title',
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
    field: 'stageId.name',
    type: 'string',
  },
];
