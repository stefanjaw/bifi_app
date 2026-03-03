import { filter } from '@avalantec/base-app/resource';
import { purchaseOrder } from '../interfaces/purchase-order';

export const purchaseOrderFilters: filter<purchaseOrder>[] = [
  {
    field: 'poNumber',
    type: 'string',
  },
  {
    field: 'contactId.fullName',
    type: 'string',
  },
  {
    field: 'status',
    type: 'string',
  },
];
