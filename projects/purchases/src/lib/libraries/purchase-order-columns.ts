import { tableColumn } from '@avalantec/base-app/resource';
import { purchaseOrder } from '../interfaces/purchase-order';

export const purchaseOrderColumns: tableColumn<purchaseOrder>[] = [
  {
    field: 'poNumber',
    title: 'Order #',
    type: 'text',
    sortable: true,
  },
  {
    field: 'contactId.fullName',
    title: 'Supplier',
    type: 'text',
  },
  {
    field: 'status',
    title: 'Status',
    type: 'text',
    sortable: true,
  },
  {
    field: 'totalAmount',
    title: 'Total',
    type: 'number',
    sortable: true,
  },
  {
    field: 'issueDate',
    title: 'Issue Date',
    type: 'date',
    sortable: true,
  },
  {
    field: 'expectedDeliveryDate',
    title: 'Expected Delivery',
    type: 'date',
    sortable: true,
  },
];
