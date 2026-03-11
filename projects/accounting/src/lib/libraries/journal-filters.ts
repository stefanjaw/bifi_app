import { filter } from '@avalantec/base-app/resource';
import { journal } from '../interfaces/journal';

export const journalFilters: filter<journal>[] = [
  { field: 'name', operator: 'like', type: 'string' },
  { field: 'code', operator: 'like', type: 'string' },
];
