import { tableColumn } from '@avalantec/base-app/resource';
import { taskType } from '../interfaces/task-type';

export const taskTypeColumns: tableColumn<taskType>[] = [
  {
    field: 'name',
    title: 'columns.name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'description',
    title: 'columns.description',
    type: 'text',
  },
  {
    field: 'active',
    title: 'columns.active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Active' : 'Inactive'),
  },
];
