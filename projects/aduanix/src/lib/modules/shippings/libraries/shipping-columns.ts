import { tableColumn } from '@avalantec/base-app/resource';
import { shipping } from '../interfaces/shipping';

export const shippingColumns: tableColumn<shipping>[] = [
  {
    field: 'name',
    title: 'Shipping',
    type: 'text',
    sortable: true,
  },
  {
    field: 'createdAt',
    title: 'Date',
    type: 'text',
    sortable: true,
  },

  {
    field: 'status',
    title: 'Status',
    type: 'text',
    sortable: true,
  },
];
