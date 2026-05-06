import { tableColumn } from '@avalantec/base-app/resource';
import { productType } from '../interfaces/product-type';

export const productTypeColumns: tableColumn<productType>[] = [
  { field: 'name', title: 'Name', type: 'text' },
  { field: 'description', title: 'Description', type: 'text' },
  { field: 'active', title: 'Active', type: 'text' },
];
