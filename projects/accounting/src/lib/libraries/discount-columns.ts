import { tableColumn } from '@avalantec/base-app/resource';
import { discount } from '../interfaces/discount';

export const discountColumns: tableColumn<discount>[] = [
  { field: 'name', title: 'name', type: 'text', sortable: true },
  { field: 'discountType', title: 'type', type: 'text' },
  { field: 'value', title: 'value', type: 'number' },
  { field: 'active', title: 'active', type: 'text' },
];
