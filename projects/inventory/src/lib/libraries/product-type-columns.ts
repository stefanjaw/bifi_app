import { tableColumn } from '@avalantec/base-app/resource';
import { productType } from '../interfaces/product-type';

export const productTypeColumns: tableColumn<productType>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  { field: 'active', title: 'active', type: 'text' },
];
