import { t } from '@avalantec/base-app/i18n';
import { tableColumn } from '@avalantec/base-app/resource';
import { salesOrderStage } from '../interfaces/sales-order-stage';

export const salesOrderStageColumns: tableColumn<salesOrderStage>[] = [
  {
    field: 'name',
    title: 'sales.columns.name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'color',
    title: 'sales.columns.color',
    type: 'text',
    parseField: (value: string) => value,
  },
  {
    field: 'order',
    title: 'sales.columns.order',
    type: 'number',
    sortable: true,
  },
  {
    field: 'isDefault',
    title: 'sales.columns.default',
    type: 'text',
    parseField: (value: boolean) =>
      value ? t('sales.columns.markDefault', {}, 'sales') : t('status.fallback.dash', {}, 'sales'),
  },
  {
    field: 'active',
    title: 'sales.columns.active',
    type: 'text',
    parseField: (value: boolean) =>
      value ? t('label.yes', {}, 'sales') : t('label.no', {}, 'sales'),
  },
];
