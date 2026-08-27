import { tableColumn } from '@avalantec/base-app/resource';
import { assetCondition } from '../interfaces/asset-condition';

/** Table column definitions for the Asset Conditions list. */
export const assetConditionColumns: tableColumn<assetCondition>[] = [
  {
    field: 'name',
    title: 'name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'description',
    title: 'description',
    type: 'text',
    sortable: true,
  },
];
