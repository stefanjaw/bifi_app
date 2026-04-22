import { tableColumn } from '@avalantec/base-app/resource';
import { salesOrder } from '../interfaces/sales-order';

export const salesOrderColumns: tableColumn<salesOrder>[] = [
  {
    field: 'number',
    title: 'Order #',
    type: 'text',
    sortable: true,
  },
  {
    field: 'stageId.name',
    title: 'Stage',
    type: 'text',
    sortable: true,
  },
  {
    field: 'crmId.title',
    title: 'Deal',
    type: 'text',
  },
  {
    field: 'company.name',
    title: 'Company',
    type: 'text',
  },
  {
    field: 'contact.name',
    title: 'Contact',
    type: 'text',
  },
  {
    field: 'amount',
    title: 'Amount',
    type: 'currency',
    sortable: true,
  },
  {
    field: 'currency',
    title: 'Currency',
    type: 'text',
  },
  {
    field: 'closeDate',
    title: 'Close Date',
    type: 'date',
    sortable: true,
  },
  {
    field: 'salesperson.username',
    title: 'Sales Rep',
    type: 'text',
  },
];
