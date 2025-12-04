import { reporting } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';
import { Badge } from '@avalantec/base-app/ui';

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
        component: Badge,
        inputs: {
          text: value.template ? 'Code provided' : 'Code not provided',
          variant: value.template ? 'success' : 'warning',
        },
      };
    },
  },
];
