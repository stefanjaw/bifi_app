import { tableColumn } from '@avalantec/base-app/resource';
import { supplier } from '../interfaces/supplier';

export const supplierColumns: tableColumn<supplier>[] = [
  {
    field: 'fullName',
    title: 'Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'email',
    title: 'Email',
    type: 'text',
  },
  {
    field: 'phoneNumber',
    title: 'Phone',
    type: 'text',
  },
  {
    field: 'type',
    title: 'Type',
    type: 'text',
  },
];
