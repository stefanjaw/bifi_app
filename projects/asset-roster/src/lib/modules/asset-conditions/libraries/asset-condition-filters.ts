import { filter } from '@avalantec/base-app/resource';
import { assetCondition } from '../interfaces/asset-condition';

/** Filter definitions for the Asset Conditions list. */
export const assetConditionFilters: filter<assetCondition>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'description',
    type: 'string',
  },
];
