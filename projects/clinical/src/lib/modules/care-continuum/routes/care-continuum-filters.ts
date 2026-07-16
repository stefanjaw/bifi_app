import { filter } from '@avalantec/base-app/resource';
import { careContinuum } from '../interfaces/care-continuum';

/** Filter definitions for care continuum table */
export const careContinuumFilters: filter<careContinuum>[] = [
  { field: 'state', type: 'string' },
  { field: 'typeOfEvent', type: 'string' },
  { field: 'insuranceCarrier', type: 'string' },
  { field: 'active', type: 'boolean' },
];
