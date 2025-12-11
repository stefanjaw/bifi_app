import { filter } from '@avalantec/base-app/resource';
import { assetType } from '../interfaces/asset-type';

export const assetTypeFilters: filter<assetType>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'description',
    type: 'string',
  },
];
