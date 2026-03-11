import { tableColumn } from '@avalantec/base-app/resource';
import { journal } from '../interfaces/journal';

export const journalColumns: tableColumn<journal>[] = [
  { field: 'name', title: 'Name', type: 'text', sortable: true },
  { field: 'code', title: 'Code', type: 'text', sortable: true },
  { field: 'journalType', title: 'Type', type: 'text' },
  { field: 'active', title: 'Active', type: 'text' },
];
