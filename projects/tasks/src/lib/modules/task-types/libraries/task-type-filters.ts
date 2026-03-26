import { filter } from '@avalantec/base-app/resource';
import { taskType } from '../interfaces/task-type';

export const taskTypeFilters: filter<taskType>[] = [
  {
    field: 'name',
    type: 'string',
  },
];
