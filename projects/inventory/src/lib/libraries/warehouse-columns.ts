import { tableColumn } from '@avalantec/base-app/resource';
import { warehouse } from '../interfaces/warehouse';

export const warehouseColumns: tableColumn<warehouse>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'code', title: 'code', type: 'text' },
  { field: 'address', title: 'address', type: 'text' },
  { field: 'active', title: 'active', type: 'text' },
];
