import { filter } from '@avalantec/base-app/resource';
import { room } from '../interfaces/room';

export const roomFilters: filter<room>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'code',
    type: 'string',
  },
  {
    field: 'address',
    type: 'string',
  },
  {
    field: 'facilityId.name',
    type: 'string',
  },
];
