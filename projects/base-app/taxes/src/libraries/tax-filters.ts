import { filter } from '@avalantec/base-app/resource';
import { tax } from '../interfaces/tax';

export const taxFilters: filter<tax>[] = [
  { field: 'name', operator: 'like', type: 'string' },
];
