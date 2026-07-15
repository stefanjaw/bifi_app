import { tableColumn } from '@avalantec/base-app/resource';
import { crm } from '../interfaces/crm';

export const crmColumns: tableColumn<crm>[] = [
  {
    field: 'title',
    title: 'sales.columns.title',
    type: 'text',
    sortable: true,
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
    field: 'amount',
    title: 'sales.columns.amount',
    type: 'number',
    sortable: true,
  },
  {
    field: 'currency.code',
    title: 'sales.columns.currency',
    type: 'text',
  },
  {
    field: 'stage.name',
    title: 'sales.columns.stage',
    type: 'text',
    sortable: true,
  },
  {
    field: 'expectedCloseDate',
    title: 'sales.columns.expectedClose',
    type: 'date',
    sortable: true,
  },
];
