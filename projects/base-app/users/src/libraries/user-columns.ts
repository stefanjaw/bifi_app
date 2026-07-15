import { user } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

export const userColumns: tableColumn<user>[] = [
  {
    field: 'username',
    title: 'username',
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
    field: 'provider',
    title: 'signedInWith',
    type: 'text',
    sortable: true,
  },
  {
    field: 'contactId.name',
    title: 'contactName',
    type: 'text',
  },
];
