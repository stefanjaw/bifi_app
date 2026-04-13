import { contact } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

export const contactColumns: tableColumn<contact>[] = [
  {
    field: 'displayName',
    title: 'Display Name',
    type: 'text',
  },
  {
    field: 'phoneNumber',
    title: 'Phone Number',
    type: 'text',
    sortable: true,
  },
  {
    field: 'email',
    title: 'Email',
    type: 'text',
    sortable: true,
  },
  {
    field: 'fullAddress',
    title: 'Address',
    type: 'text',
    sortable: true,
  },
];
