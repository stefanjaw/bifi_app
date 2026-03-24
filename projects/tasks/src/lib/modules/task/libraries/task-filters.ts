import { filter } from '@avalantec/base-app/resource';
import { task } from '../interfaces/task';

export const taskFilters: filter<task>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'priority',
    type: 'string',
  },
  {
    field: 'stage.name',
    type: 'string',
  },
  {
    field: 'assigned.username',
    type: 'string',
  },
];
