import { tableColumn } from '@avalantec/base-app/resource';
import { facility } from '../interfaces/facility';
import { room } from '../interfaces/room';

export const facilityColumns: tableColumn<facility>[] = [
  {
    field: 'name',
    title: 'Facility name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'contactId.name',
    title: 'Related to',
    type: 'text',
    sortable: true,
  },
  {
    field: 'rooms',
    title: 'Rooms',
    type: 'text',
    parseField: (value: room[]) => value.map(room => room.name).join(', ') || 'No rooms',
  },
];
