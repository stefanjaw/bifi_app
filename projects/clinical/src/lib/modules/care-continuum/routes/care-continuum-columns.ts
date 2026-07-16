import { tableColumn } from '@avalantec/base-app/resource';
import { careContinuum } from '../interfaces/care-continuum';

/** Column definitions for care continuum table */
export const careContinuumColumns: tableColumn<careContinuum>[] = [
  { field: 'patientId', title: 'patient', type: 'text' },
  { field: 'typeOfEvent', title: 'eventType', type: 'text' },
  { field: 'state', title: 'state', type: 'text' },
  { field: 'insuranceCarrier', title: 'insurance', type: 'text' },
  { field: 'policyNumber', title: 'policyNumber', type: 'text' },
  { field: 'endDate', title: 'endDate', type: 'date' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];
