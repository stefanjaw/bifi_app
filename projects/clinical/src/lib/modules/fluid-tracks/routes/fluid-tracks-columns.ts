import { tableColumn } from '@avalantec/base-app/resource';
import { fluidTrack } from '../interfaces/fluid-tracks';

/** Column definitions for fluid tracks table */
export const fluidTrackColumns: tableColumn<fluidTrack>[] = [
  { field: 'dayFluidTrack', title: 'dayFluidTrack', type: 'date' },
  { field: 'patientId', title: 'patientId', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];
