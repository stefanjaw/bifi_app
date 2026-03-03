import { filter } from '@avalantec/base-app/resource';
import { location } from '../interfaces/location';

export const locationFilters: filter<location>[] = [
  { field: 'name', operator: 'like', type: 'string' },
  { field: 'code', operator: 'like', type: 'string' },
];
