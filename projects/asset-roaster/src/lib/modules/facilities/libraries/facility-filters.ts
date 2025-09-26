import { filter } from '@avalantec/base-app/resource';
import { facility } from '../interfaces/facility';

export const facilityFilters: filter<facility>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'mainPlace.name',
    type: 'string',
  },
];
