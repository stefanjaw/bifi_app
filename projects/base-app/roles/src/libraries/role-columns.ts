import { t } from '@avalantec/base-app/i18n';
import { role } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

export const roleColumns: tableColumn<role>[] = [
  {
    field: 'name',
    title: 'roleName',
    type: 'text',
    sortable: true,
  },
  {
    field: 'policies',
    title: 'totalPolicies',
    parseField: (value: role['policies']) =>
      t('policies.count', { count: value.length }, 'base-app/roles'),
    type: 'text',
  },
];
