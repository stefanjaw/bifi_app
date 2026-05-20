import { user } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

export const userColumns: tableColumn<user>[] = [
  {
    field: 'username',
    title: 'Username',
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
    field: 'provider',
    title: 'Signed in with',
    type: 'text',
    sortable: true,
  },
  {
    field: 'contactId.name',
    title: 'Contact Name',
    type: 'text',
  },
];
