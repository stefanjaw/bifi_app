import { filter } from '@avalantec/base-app/resource';
import { vitalSign, vitalSignType } from '../interfaces/vital-signs';

/** Filter configuration for vital signs list */
export const vitalSignFilters: filter<vitalSign>[] = [
  { field: 'patientId', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for vital sign types list */
export const vitalSignTypeFilters: filter<vitalSignType>[] = [
  { field: 'name', type: 'string' },
  { field: 'active', type: 'boolean' },
];
