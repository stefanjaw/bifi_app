import { tableColumn } from '@avalantec/base-app/resource';
import { crm } from '../interfaces/crm';

export const crmColumns: tableColumn<crm>[] = [
  {
    field: 'title',
    title: 'Title',
    type: 'text',
    sortable: true,
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
    type: 'number',
    sortable: true,
  },
  {
    field: 'currency',
    title: 'Currency',
    type: 'text',
  },
  {
    field: 'stage.name',
    title: 'Stage',
    type: 'text',
    sortable: true,
  },
  {
    field: 'expectedCloseDate',
    title: 'Expected Close',
    type: 'date',
    sortable: true,
  },
];
