import { tableColumn } from '@avalantec/base-app/resource';
import { assetType } from '../interfaces/asset-type';

export const assetTypeColumns: tableColumn<assetType>[] = [
  {
    field: 'name',
    title: 'Asset Type Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'description',
    title: 'Description',
    type: 'text',
    sortable: true,
  },
];
