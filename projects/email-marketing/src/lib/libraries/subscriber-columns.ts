import { tableColumn } from '@avalantec/base-app/resource';
import { subscriber } from '../interfaces/subscriber';
import { mailingList } from '../interfaces/mailing-list';

export const subscriberColumns: tableColumn<subscriber>[] = [
  {
    field: 'email',
    title: 'Email',
    type: 'text',
    sortable: true,
  },
  {
    field: 'name',
    title: 'Name',
    type: 'text',
  },
  {
    field: 'listId',
    title: 'List',
    type: 'text',
    parseField: (value: string | mailingList) =>
      typeof value === 'object' && value ? (value as mailingList).name : '',
  },
  {
    field: 'status',
    title: 'Status',
    type: 'text',
    sortable: true,
  },
];
