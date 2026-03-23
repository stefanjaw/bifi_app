import { filter } from '@avalantec/base-app/resource';
import { helpdeskStage } from '../../../interfaces/helpdesk-stage';

export const helpdeskStageFilters: filter<helpdeskStage>[] = [
  {
    field: 'name',
    type: 'string',
  },
];
