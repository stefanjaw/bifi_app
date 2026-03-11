import { filter } from '@avalantec/base-app/resource';
import { fiscalPosition } from '../interfaces/fiscal-position';

export const fiscalPositionFilters: filter<fiscalPosition>[] = [
  { field: 'name', operator: 'like', type: 'string' },
];
