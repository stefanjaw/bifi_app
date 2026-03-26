import { filter } from '@avalantec/base-app/resource';
import { taskStage } from '../interfaces/task-stage';

export const taskStageFilters: filter<taskStage>[] = [
  {
    field: 'name',
    type: 'string',
  },
];
