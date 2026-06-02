import { tableColumn } from '@avalantec/base-app/resource';
import { emailTemplate } from '../interfaces/email-template';

export const emailTemplateColumns: tableColumn<emailTemplate>[] = [
  {
    field: 'name',
    title: 'Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'category',
    title: 'Category',
    type: 'text',
    sortable: true,
  },
  {
    field: 'description',
    title: 'Description',
    type: 'text',
  },
];
