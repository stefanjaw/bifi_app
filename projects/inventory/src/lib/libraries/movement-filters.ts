import { filter } from '@avalantec/base-app/resource';
import { stockMovement } from '../interfaces/stock-movement';

export const movementFilters: filter<stockMovement>[] = [
  { field: 'type', operator: '==', type: 'string' },
  { field: 'reference', operator: 'like', type: 'string' },
];
