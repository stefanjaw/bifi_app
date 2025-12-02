import { reporting } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

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
    sortable: true,
    parseField(value: string) {
      return value.substring(0, 200) + '…';
    },
  },
];
