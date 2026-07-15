import { filter } from '@avalantec/base-app/resource';
import { productType } from '../interfaces/product-type';

export const productTypeFilters: filter<productType>[] = [
  { field: 'name', operator: 'like', type: 'string' },
];
