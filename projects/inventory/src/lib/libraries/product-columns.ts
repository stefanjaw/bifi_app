import { tableColumn } from '@avalantec/base-app/resource';
import { product } from '../interfaces/product';

export const productColumns: tableColumn<product>[] = [
  { field: 'name', title: 'Name', type: 'text' },
  { field: 'sku', title: 'SKU', type: 'text' },
  { field: 'unit', title: 'Unit', type: 'text' },
  { field: 'costPrice', title: 'Cost Price', type: 'currency' },
  { field: 'salePrice', title: 'Sale Price', type: 'currency' },
  { field: 'active', title: 'Active', type: 'text' },
];
