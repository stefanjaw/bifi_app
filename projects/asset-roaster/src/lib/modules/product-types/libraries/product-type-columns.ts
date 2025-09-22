import { tableColumn } from '@avalantec/base-app/resource';
import { productType } from '../interfaces/product-type';

export const productTypeColumns: tableColumn<productType>[] = [
  {
    field: 'name',
    title: 'Facility Name',
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
