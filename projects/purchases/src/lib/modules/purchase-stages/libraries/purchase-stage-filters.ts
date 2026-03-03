import { filter } from '@avalantec/base-app/resource';
import { purchaseStage } from '../interfaces/purchase-stage';

export const purchaseStageFilters: filter<purchaseStage>[] = [
  {
    field: 'name',
    type: 'string',
  },
];
