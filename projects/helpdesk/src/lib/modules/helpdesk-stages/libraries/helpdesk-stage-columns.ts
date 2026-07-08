import { tableColumn } from '@avalantec/base-app/resource';
import { helpdeskStage } from '../../../interfaces/helpdesk-stage';

export const helpdeskStageColumns: tableColumn<helpdeskStage>[] = [
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
    field: 'isDefault',
    title: 'columns.default',
    type: 'text',
    parseField: (value: boolean) => (value ? '✓ Default' : '—'),
  },
  {
    field: 'active',
    title: 'columns.active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Active' : 'Inactive'),
  },
];
