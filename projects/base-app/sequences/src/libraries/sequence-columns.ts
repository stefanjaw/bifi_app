import { tableColumn } from '@avalantec/base-app/resource';
import { sequence } from '../interfaces/sequence';

export const sequenceColumns: tableColumn<sequence>[] = [
  {
    field: 'name',
    title: 'Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'prefix',
    title: 'Prefix',
    type: 'text',
    sortable: true,
  },
  {
    field: 'step',
    title: 'Step',
    type: 'text',
    sortable: true,
  },
  {
    field: 'size',
    title: 'Size',
    type: 'text',
    sortable: true,
  },
  {
    field: 'active',
    title: 'Active',
    type: 'text',
  },
];
