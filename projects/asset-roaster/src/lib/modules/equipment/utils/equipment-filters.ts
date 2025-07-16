import { filter } from '@avalantec/base-app';
import { product } from '../interfaces/product.model';

// TODO: Add more filters, e.g. product type, vendor
export const equipmentFilters: filter<product>[] = [
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
