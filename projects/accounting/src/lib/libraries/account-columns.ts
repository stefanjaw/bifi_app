import { tableColumn } from '@avalantec/base-app/resource';
import { account } from '../interfaces/account';

export const accountColumns: tableColumn<account>[] = [
  { field: 'code', title: 'Code', type: 'text', sortable: true },
  { field: 'name', title: 'Name', type: 'text', sortable: true },
  { field: 'type', title: 'Type', type: 'text' },
  { field: 'active', title: 'Active', type: 'text' },
];
