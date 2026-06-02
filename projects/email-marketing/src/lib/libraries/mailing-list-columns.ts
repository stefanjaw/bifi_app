import { tableColumn } from '@avalantec/base-app/resource';
import { mailingList } from '../interfaces/mailing-list';

export const mailingListColumns: tableColumn<mailingList>[] = [
  {
    field: 'name',
    title: 'Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'description',
    title: 'Description',
    type: 'text',
  },
  {
    field: 'subscriberCount',
    title: 'Subscribers',
    type: 'number',
    sortable: true,
  },
];
