import { tableColumn } from '@avalantec/base-app/resource';
import { discount } from '../interfaces/discount';

export const discountColumns: tableColumn<discount>[] = [
  { field: 'name', title: 'Name', type: 'text', sortable: true },
  { field: 'discountType', title: 'Type', type: 'text' },
  { field: 'value', title: 'Value', type: 'number' },
  { field: 'active', title: 'Active', type: 'text' },
];
