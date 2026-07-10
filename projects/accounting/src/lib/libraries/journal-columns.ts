import { tableColumn } from '@avalantec/base-app/resource';
import { journal } from '../interfaces/journal';

export const journalColumns: tableColumn<journal>[] = [
  { field: 'name', title: 'name', type: 'text', sortable: true },
  { field: 'code', title: 'code', type: 'text', sortable: true },
  { field: 'journalType', title: 'type', type: 'text' },
  { field: 'active', title: 'active', type: 'text' },
];
