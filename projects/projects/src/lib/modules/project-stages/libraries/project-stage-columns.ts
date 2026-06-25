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
    parseField: (value: string | null | undefined) => (value && value.trim() ? value : 'Not set'),
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
