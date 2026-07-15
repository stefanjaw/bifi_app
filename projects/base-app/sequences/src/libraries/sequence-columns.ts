import { tableColumn } from '@avalantec/base-app/resource';
import { sequence } from '../interfaces/sequence';

export const sequenceColumns: tableColumn<sequence>[] = [
  {
    field: 'name',
    title: 'name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'prefix',
    title: 'prefix',
    type: 'text',
    sortable: true,
  },
  {
    field: 'step',
    title: 'step',
    type: 'text',
    sortable: true,
  },
  {
    field: 'size',
    title: 'size',
    type: 'text',
    sortable: true,
  },
  {
    field: 'active',
    title: 'active',
    type: 'text',
  },
];
