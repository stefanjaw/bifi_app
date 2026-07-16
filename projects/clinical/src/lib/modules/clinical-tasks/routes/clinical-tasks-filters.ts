import { filter } from '@avalantec/base-app/resource';
import { recurrentTask } from '../interfaces/recurrent-task';

/** Filter configuration for recurrent tasks list */
export const recurrentTaskFilters: filter<recurrentTask>[] = [
  { field: 'stage', type: 'string' },
  { field: 'priority', type: 'string' },
  { field: 'active', type: 'boolean' },
];
