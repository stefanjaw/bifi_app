import { tableColumn } from '@avalantec/base-app/resource';
import { salesOrder } from '../interfaces/sales-order';

export const salesOrderColumns: tableColumn<salesOrder>[] = [
  {
    field: 'number',
    title: 'sales.columns.orderNumber',
    type: 'text',
    sortable: true,
  },
  {
    field: 'stageId.name',
    title: 'sales.columns.stage',
    type: 'text',
    sortable: true,
  },
  {
    field: 'crmId.title',
    title: 'sales.columns.deal',
    type: 'text',
  },
  {
    field: 'company.name',
    title: 'sales.columns.company',
    type: 'text',
  },
  {
    field: 'contact.name',
    title: 'sales.columns.contact',
    type: 'text',
  },
  {
    field: 'grandTotal',
    title: 'sales.columns.grandTotal',
    type: 'currency',
    sortable: true,
  },
  {
    field: 'taxTotal',
    title: 'sales.columns.tax',
    type: 'currency',
    sortable: true,
  },
  {
    field: 'currency.code',
    title: 'sales.columns.currency',
    type: 'text',
  },
  {
    field: 'closeDate',
    title: 'sales.columns.closeDate',
    type: 'date',
    sortable: true,
  },
  {
    field: 'salesperson.username',
    title: 'sales.columns.salesRep',
    type: 'text',
  },
];
