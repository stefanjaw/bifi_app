import { tableColumn } from '@avalantec/base-app/resource';
import { room } from '../interfaces/room';

export const roomColumns: tableColumn<room>[] = [
  {
    field: 'name',
    title: 'facilityName',
    type: 'text',
    sortable: true,
  },
  {
    field: 'code',
    title: 'code',
    type: 'text',
    sortable: true,
  },
  {
    field: 'address',
    title: 'address',
    type: 'number',
    sortable: true,
  },
  {
    field: 'facilityId.name',
    title: 'facility',
    type: 'text',
    sortable: true,
  },
];
