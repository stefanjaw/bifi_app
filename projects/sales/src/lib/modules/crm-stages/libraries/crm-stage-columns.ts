import { tableColumn } from '@avalantec/base-app/resource';
import { crmStage } from '../interfaces/crm-stage';

export const crmStageColumns: tableColumn<crmStage>[] = [
  {
    field: 'name',
    title: 'Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'order',
    title: 'Order',
    type: 'number',
    sortable: true,
  },
  {
    field: 'probability',
    title: 'Probability (%)',
    type: 'number',
    sortable: true,
  },
  {
    field: 'isWon',
    title: 'Won',
    type: 'text',
    parseField: (value: boolean) => (value ? '✓ Won' : '—'),
  },
  {
    field: 'isLost',
    title: 'Lost',
    type: 'text',
    parseField: (value: boolean) => (value ? '✓ Lost' : '—'),
  },
];
