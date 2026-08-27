import { filter } from '@avalantec/base-app/resource';
import { assetRoster } from '../interfaces/asset-roster';

export const assetRosterFilters: filter<assetRoster>[] = [
  {
    field: 'productModel',
    type: 'string',
  },
  {
    field: 'serialNumber',
    type: 'string',
  },
  {
    field: 'conditionId.name',
    type: 'string',
  },
  {
    field: 'assetTypeIds.name',
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
  {
    field: 'locationId.name',
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
