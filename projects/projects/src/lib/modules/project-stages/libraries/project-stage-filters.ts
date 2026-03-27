import { filter } from '@avalantec/base-app/resource';
import { projectStage } from '../interfaces/project-stage';

export const projectStageFilters: filter<projectStage>[] = [
  {
    field: 'name',
    type: 'string',
  },
];
