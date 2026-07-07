import { contact } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

export const contactColumns: tableColumn<contact>[] = [
  {
    field: 'displayName',
    title: 'displayName',
    type: 'text',
  },
  {
    field: 'phoneNumber',
    title: 'phoneNumber',
    type: 'text',
    sortable: true,
  },
  {
    field: 'email',
    title: 'email',
    type: 'text',
    sortable: true,
  },
  {
    field: 'fullAddress',
    title: 'address',
    type: 'text',
    sortable: true,
  },
];
