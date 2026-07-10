import { tableColumn } from '@avalantec/base-app/resource';
import { account } from '../interfaces/account';

export const accountColumns: tableColumn<account>[] = [
  { field: 'code', title: 'code', type: 'text', sortable: true },
  { field: 'name', title: 'name', type: 'text', sortable: true },
  { field: 'type', title: 'type', type: 'text' },
  { field: 'active', title: 'active', type: 'text' },
];
