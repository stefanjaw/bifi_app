import { t } from '@avalantec/base-app/i18n';
import { tableColumn } from '@avalantec/base-app/resource';
import { purchaseStage } from '../interfaces/purchase-stage';

export const purchaseStageColumns: tableColumn<purchaseStage>[] = [
  {
    field: 'name',
    title: 'name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'color',
    title: 'color',
    type: 'text',
    parseField: (value: string) => value ?? t('status.fallback.dash', {}, 'purchases'),
  },
  {
    field: 'order',
    title: 'order',
    type: 'number',
    sortable: true,
  },
];
