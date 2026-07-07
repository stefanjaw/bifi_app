import { policy } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

export const policyColumns: tableColumn<policy<any, any>>[] = [
  {
    field: 'name',
    title: 'policyName',
    type: 'text',
    sortable: true,
  },
  {
    field: 'resource',
    title: 'resource',
    type: 'text',
    sortable: true,
  },
  { field: 'type', title: 'type', type: 'text', sortable: true },
  {
    field: 'conditions',
    title: 'totalConditions',
    type: 'text',
    parseField: (value: policy<string, string>['conditions']) => `${value.length} conditions`,
  },
];
