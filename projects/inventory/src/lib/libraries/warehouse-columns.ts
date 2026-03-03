import { tableColumn } from '@avalantec/base-app/resource';
import { warehouse } from '../interfaces/warehouse';

export const warehouseColumns: tableColumn<warehouse>[] = [
  { field: 'name', title: 'Name', type: 'text' },
  { field: 'code', title: 'Code', type: 'text' },
  { field: 'address', title: 'Address', type: 'text' },
  { field: 'active', title: 'Active', type: 'text' },
];
