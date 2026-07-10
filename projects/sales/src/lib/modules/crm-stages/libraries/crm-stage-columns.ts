import { t } from '@avalantec/base-app/i18n';
import { tableColumn } from '@avalantec/base-app/resource';
import { crmStage } from '../interfaces/crm-stage';

export const crmStageColumns: tableColumn<crmStage>[] = [
  {
    field: 'name',
    title: 'sales.columns.name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'order',
    title: 'sales.columns.order',
    type: 'number',
    sortable: true,
  },
  {
    field: 'probability',
    title: 'sales.columns.probability',
    type: 'number',
    sortable: true,
  },
  {
    field: 'isWon',
    title: 'sales.columns.won',
    type: 'text',
    parseField: (value: boolean) =>
      value ? t('sales.columns.markWon', {}, 'sales') : t('status.fallback.dash', {}, 'sales'),
  },
  {
    field: 'isLost',
    title: 'sales.columns.lost',
    type: 'text',
    parseField: (value: boolean) =>
      value ? t('sales.columns.markLost', {}, 'sales') : t('status.fallback.dash', {}, 'sales'),
  },
];
