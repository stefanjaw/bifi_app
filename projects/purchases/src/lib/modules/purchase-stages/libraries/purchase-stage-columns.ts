import { tableColumn } from '@avalantec/base-app/resource';
import { purchaseStage } from '../interfaces/purchase-stage';

export const purchaseStageColumns: tableColumn<purchaseStage>[] = [
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
    parseField: (value: string) => value ?? '—',
  },
  {
    field: 'order',
    title: 'Order',
    type: 'number',
    sortable: true,
  },
];
