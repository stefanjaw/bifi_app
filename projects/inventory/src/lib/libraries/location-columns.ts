import { tableColumn } from '@avalantec/base-app/resource';
import { location } from '../interfaces/location';

export const locationColumns: tableColumn<location>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'code', title: 'code', type: 'text' },
  { field: 'warehouseId.name', title: 'warehouse', type: 'text' },
  { field: 'capacity', title: 'capacity', type: 'number' },
  { field: 'active', title: 'active', type: 'text' },
];
