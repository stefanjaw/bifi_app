import { filter } from '@avalantec/base-app/resource';
import { product } from '../interfaces/product';

export const productFilters: filter<product>[] = [
  { field: 'name', operator: 'like', type: 'string' },
  { field: 'sku', operator: 'like', type: 'string' },
];
