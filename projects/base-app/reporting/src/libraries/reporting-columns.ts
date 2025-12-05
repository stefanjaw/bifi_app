import { reporting } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';
import { Tag } from 'primeng/tag';

export const reportingColumns: tableColumn<reporting>[] = [
  {
    field: 'title',
    title: 'Template',
    type: 'text',
    sortable: true,
  },
  {
    field: 'model',
    title: 'Model',
    type: 'text',
    sortable: true,
  },
  {
    field: 'template',
    title: 'Template',
    type: 'text',
    component: (value: reporting) => {
      return {
        component: Tag,
        inputs: {
          value: value.template ? 'Code provided' : 'Code not provided',
          severity: value.template ? 'success' : 'warn',
        },
      };
    },
  },
];
