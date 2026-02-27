import { filter } from '@avalantec/base-app/resource';
import { crmStage } from '../interfaces/crm-stage';

export const crmStageFilters: filter<crmStage>[] = [
  {
    field: 'name',
    type: 'string',
  },
];
