import { tableColumn } from '@avalantec/base-app/resource';
import { taskStage } from '../interfaces/task-stage';

export const taskStageColumns: tableColumn<taskStage>[] = [
  {
    field: 'name',
    title: 'Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'description',
    title: 'Description',
    type: 'text',
  },
  {
    field: 'isDefault',
    title: 'Default',
    type: 'text',
    parseField: (value: boolean) => (value ? '✓ Default' : '—'),
  },
  {
    field: 'active',
    title: 'Active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Active' : 'Inactive'),
  },
];
