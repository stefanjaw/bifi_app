import { tableColumn } from '@avalantec/base-app/resource';
import { tax } from '../interfaces/tax';

export const taxColumns: tableColumn<tax>[] = [
  { field: 'name', title: 'name', type: 'text', sortable: true },
  { field: 'taxType', title: 'type', type: 'text' },
  { field: 'percentage', title: 'percentage', type: 'number' },
  { field: 'active', title: 'active', type: 'text' },
];
