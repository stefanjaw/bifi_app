import { tableColumn } from '@avalantec/base-app/resource';
import { vitalSign, vitalSignType } from '../interfaces/vital-signs';

/** Column definitions for vital signs table */
export const vitalSignColumns: tableColumn<vitalSign>[] = [
  { field: 'dateVital', title: 'dateVital', type: 'date' },
  { field: 'patientId', title: 'patientId', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Column definitions for vital sign types table */
export const vitalSignTypeColumns: tableColumn<vitalSignType>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'value', title: 'value', type: 'text' },
  { field: 'unit', title: 'unit', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];
