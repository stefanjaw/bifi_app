import { tableColumn } from '@avalantec/base-app/resource';
import { salesTarget } from '../interfaces/sales-target';

export const salesTargetColumns: tableColumn<salesTarget>[] = [
  {
    field: 'name',
    title: 'Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'year',
    title: 'Year',
    type: 'number',
    sortable: true,
  },
  {
    field: 'month',
    title: 'Month',
    type: 'number',
    sortable: true,
  },
  {
    field: 'targetAmount',
    title: 'Target',
    type: 'currency',
    sortable: true,
  },
  {
    field: 'currency',
    title: 'Currency',
    type: 'text',
  },
  {
    field: 'salesperson.username',
    title: 'Sales Rep',
    type: 'text',
  },
];
