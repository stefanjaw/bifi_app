import { tableColumn } from '@avalantec/base-app/resource';
import { assetType } from '../interfaces/asset-type';

export const assetTypeColumns: tableColumn<assetType>[] = [
  {
    field: 'name',
    title: 'assetTypeName',
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
