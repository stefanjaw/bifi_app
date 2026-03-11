import { tableColumn } from '@avalantec/base-app/resource';
import { tax } from '../interfaces/tax';

export const taxColumns: tableColumn<tax>[] = [
  { field: 'name', title: 'Name', type: 'text', sortable: true },
  { field: 'taxType', title: 'Type', type: 'text' },
  { field: 'percentage', title: 'Percentage (%)', type: 'number' },
  { field: 'active', title: 'Active', type: 'text' },
];
