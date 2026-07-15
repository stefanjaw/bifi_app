import { t } from '@avalantec/base-app/i18n';
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
  {
    field: 'type',
    title: 'type',
    type: 'text',
    sortable: true,
    parseField: (value: string) => t('form.generalInfo.type.' + value, {}, 'base-app/policies'),
  },
  {
    field: 'conditions',
    title: 'totalConditions',
    type: 'text',
    parseField: (value: policy<string, string>['conditions']) =>
      t('conditions.count', { count: value.length }, 'base-app/policies'),
  },
];
