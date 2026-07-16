import { filter } from '@avalantec/base-app/resource';
import { fluidTrack } from '../interfaces/fluid-tracks';

/** Filter configuration for fluid tracks list */
export const fluidTrackFilters: filter<fluidTrack>[] = [
  { field: 'patientId', type: 'string' },
  { field: 'active', type: 'boolean' },
];
