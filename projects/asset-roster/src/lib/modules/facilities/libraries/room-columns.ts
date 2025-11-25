import { tableColumn } from '@avalantec/base-app/resource';
import { room } from '../interfaces/room';

export const roomColumns: tableColumn<room>[] = [
  {
    field: 'name',
    title: 'Facility Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'code',
    title: 'Code',
    type: 'text',
    sortable: true,
  },
  {
    field: 'address',
    title: 'Address',
    type: 'number',
    sortable: true,
  },
  {
    field: 'facilityId.name',
    title: 'Facility',
    type: 'text',
    sortable: true,
  },
];
