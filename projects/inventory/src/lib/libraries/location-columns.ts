import { tableColumn } from '@avalantec/base-app/resource';
import { location } from '../interfaces/location';

export const locationColumns: tableColumn<location>[] = [
  { field: 'name', title: 'Name', type: 'text' },
  { field: 'code', title: 'Code', type: 'text' },
  { field: 'warehouseId.name', title: 'Warehouse', type: 'text' },
  { field: 'capacity', title: 'Capacity', type: 'number' },
  { field: 'active', title: 'Active', type: 'text' },
];
