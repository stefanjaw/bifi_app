import { tableColumn } from '@avalantec/base-app/resource';
import { subscriber } from '../interfaces/subscriber';
import { mailingList } from '../interfaces/mailing-list';

export const subscriberColumns: tableColumn<subscriber>[] = [
  {
    field: 'email',
    title: 'email',
    type: 'text',
    sortable: true,
  },
  {
    field: 'name',
    title: 'name',
    type: 'text',
  },
  {
    field: 'listId',
    title: 'list',
    type: 'text',
    parseField: (value: string | mailingList) =>
      typeof value === 'object' && value ? (value as mailingList).name : '',
  },
  {
    field: 'status',
    title: 'status',
    type: 'text',
    sortable: true,
  },
];
