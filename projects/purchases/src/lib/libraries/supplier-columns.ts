import { tableColumn } from '@avalantec/base-app/resource';
import { supplier } from '../interfaces/supplier';

export const supplierColumns: tableColumn<supplier>[] = [
  {
    field: 'fullName',
    title: 'name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'email',
    title: 'email',
    type: 'text',
  },
  {
    field: 'phoneNumber',
    title: 'phone',
    type: 'text',
  },
  {
    field: 'type',
    title: 'type',
    type: 'text',
  },
];
