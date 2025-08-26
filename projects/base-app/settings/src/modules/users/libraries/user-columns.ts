import { tableColumn } from '@avalantec/base-app/resource';
import { user } from '@avalantec/base-app/core';

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
    field: 'roles',
    title: 'Roles',
    type: 'text',
    parseField(value: user['roles']) {
      return value.map(role => role.name).join(', ');
    },
  },
];
