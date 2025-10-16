import { role } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

export const roleColumns: tableColumn<role>[] = [
  {
    field: 'name',
    title: 'Role Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'policies',
    title: 'Total Policies',
    parseField: (value: role['policies']) => `${value.length} Policies`,
    type: 'text',
  },
];
