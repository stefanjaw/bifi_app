import { policy } from '@avalantec/base-app/core';
import { tableColumn } from '@avalantec/base-app/resource';

export const policyColumns: tableColumn<policy<string, string>>[] = [
  {
    field: 'name',
    title: 'Policy Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'resource',
    title: 'Resource',
    type: 'text',
    sortable: true,
  },
  {
    field: 'action',
    title: 'Action',
    type: 'text',
    sortable: true,
  },
  {
    field: 'conditions',
    title: 'Total Conditions',
    type: 'text',
    parseField: (value: policy<string, string>['conditions']) => `${value.length} conditions`,
  },
];
