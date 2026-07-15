import { tableColumn } from '@avalantec/base-app/resource';
import { salesTarget } from '../interfaces/sales-target';

export const salesTargetColumns: tableColumn<salesTarget>[] = [
  {
    field: 'name',
    title: 'sales.columns.name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'year',
    title: 'sales.columns.year',
    type: 'number',
    sortable: true,
  },
  {
    field: 'month',
    title: 'sales.columns.month',
    type: 'number',
    sortable: true,
  },
  {
    field: 'targetAmount',
    title: 'sales.columns.target',
    type: 'currency',
    sortable: true,
  },
  {
    field: 'currency',
    title: 'sales.columns.currency',
    type: 'text',
  },
  {
    field: 'salesperson.username',
    title: 'sales.columns.salesRep',
    type: 'text',
  },
];
