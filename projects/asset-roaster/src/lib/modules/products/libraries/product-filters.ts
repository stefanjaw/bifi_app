import { filter } from '@avalantec/base-app/resource';
import { product } from '../interfaces/product';

// TODO: Add more filters, e.g. product type, vendor
export const productFilters: filter<product>[] = [
  {
    field: 'productModel',
    type: 'string',
  },
  {
    field: 'serialNumber',
    type: 'string',
  },
  {
    field: 'acquiredDate',
    type: 'date',
  },
  {
    field: 'acquiredPrice',
    type: 'number',
  },
  {
    field: 'currentPrice',
    type: 'number',
  },
  {
    field: 'condition',
    type: 'string',
  },
  {
    field: 'warrantyDate',
    type: 'date',
  },
  {
    field: 'active',
    type: 'boolean',
  },
];
