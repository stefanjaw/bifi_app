import { tableColumn } from '@avalantec/base-app/resource';
import { projectStage } from '../interfaces/project-stage';

export const projectStageColumns: tableColumn<projectStage>[] = [
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
