import { tableColumn } from '@avalantec/base-app/resource';
import { purchaseOrder } from '../interfaces/purchase-order';

export const purchaseOrderColumns: tableColumn<purchaseOrder>[] = [
  {
    field: 'poNumber',
    title: 'orderNumber',
    type: 'text',
    sortable: true,
  },
  {
    field: 'contactId.fullName',
    title: 'supplier',
    type: 'text',
  },
  {
    field: 'status',
    title: 'status',
    type: 'text',
    sortable: true,
  },
  {
    field: 'totalAmount',
    title: 'total',
    type: 'number',
    sortable: true,
  },
  {
    field: 'issueDate',
    title: 'issueDate',
    type: 'date',
    sortable: true,
  },
  {
    field: 'expectedDeliveryDate',
    title: 'expectedDelivery',
    type: 'date',
    sortable: true,
  },
];
