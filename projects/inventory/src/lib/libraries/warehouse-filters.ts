import { filter } from '@avalantec/base-app/resource';
import { warehouse } from '../interfaces/warehouse';

export const warehouseFilters: filter<warehouse>[] = [
  { field: 'name', operator: 'like', type: 'string' },
  { field: 'code', operator: 'like', type: 'string' },
];
