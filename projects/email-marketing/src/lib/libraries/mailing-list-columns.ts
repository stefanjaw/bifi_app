import { tableColumn } from '@avalantec/base-app/resource';
import { mailingList } from '../interfaces/mailing-list';

export const mailingListColumns: tableColumn<mailingList>[] = [
  {
    field: 'name',
    title: 'name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'description',
    title: 'description',
    type: 'text',
  },
  {
    field: 'subscriberCount',
    title: 'subscribers',
    type: 'number',
    sortable: true,
  },
];
