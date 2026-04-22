import { filter } from '@avalantec/base-app/resource';
import { salesOrderStage } from '../interfaces/sales-order-stage';

export const salesOrderStageFilters: filter<salesOrderStage>[] = [
  {
    field: 'name',
    type: 'string',
  },
];
