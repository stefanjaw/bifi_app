import { filter } from '@avalantec/base-app/resource';
import { emailTemplate } from '../interfaces/email-template';

export const emailTemplateFilters: filter<emailTemplate>[] = [
  {
    field: 'name',
    type: 'string',
  },
];
