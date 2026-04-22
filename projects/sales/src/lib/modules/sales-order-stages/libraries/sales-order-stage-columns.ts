import { tableColumn } from '@avalantec/base-app/resource';
import { salesOrderStage } from '../interfaces/sales-order-stage';

export const salesOrderStageColumns: tableColumn<salesOrderStage>[] = [
  {
    field: 'name',
    title: 'Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'color',
    title: 'Color',
    type: 'text',
    parseField: (value: string) => value,
  },
  {
    field: 'order',
    title: 'Order',
    type: 'number',
    sortable: true,
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
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];
