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
    field: 'condition',
    type: 'string',
  },
  {
    field: 'productTypeIds.name',
    type: 'string',
  },
  {
    field: 'vendorIds.name',
    type: 'string',
  },
  {
    field: 'makeIds.name',
    type: 'string',
  },
  // {
  //   field: 'acquiredDate',
  //   type: 'date',
  // },
  // {
  //   field: 'acquiredPrice',
  //   type: 'number',
  // },
  // {
  //   field: 'currentPrice',
  //   type: 'number',
  // },
  // {
  //   field: 'warrantyDate',
  //   type: 'date',
  // },
  // {
  //   field: 'active',
  //   type: 'boolean',
  // },
];
