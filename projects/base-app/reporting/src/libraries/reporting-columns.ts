import { t } from '@avalantec/base-app/i18n';
import { reporting } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';
import { Tag } from 'primeng/tag';

export const reportingColumns: tableColumn<reporting>[] = [
  {
    field: 'title',
    title: 'report',
    type: 'text',
    sortable: true,
  },
  {
    field: 'model',
    title: 'model',
    type: 'text',
    sortable: true,
  },
  {
    field: 'template',
    title: 'templateFile',
    type: 'text',
    component: (value: reporting) => {
      return {
        component: Tag,
        inputs: {
          value: value.template
            ? t('status.codeProvided', {}, 'base-app/reporting')
            : t('status.codeNotProvided', {}, 'base-app/reporting'),
          severity: value.template ? 'success' : 'warn',
        },
      };
    },
  },
];
