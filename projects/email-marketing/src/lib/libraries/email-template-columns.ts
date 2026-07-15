import { tableColumn } from '@avalantec/base-app/resource';
import { emailTemplate } from '../interfaces/email-template';

export const emailTemplateColumns: tableColumn<emailTemplate>[] = [
  {
    field: 'name',
    title: 'name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'category',
    title: 'category',
    type: 'text',
    sortable: true,
  },
  {
    field: 'description',
    title: 'description',
    type: 'text',
  },
];
