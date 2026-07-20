import { tableColumn } from '@avalantec/base-app/resource';
import { staff, staffGroup, shift } from '../interfaces/staff';

/** Column definitions for staff list */
export const staffColumns: tableColumn<staff>[] = [
  { field: 'personnelId', title: 'personnelId', type: 'text' },
  { field: 'department', title: 'department', type: 'text' },
  { field: 'position', title: 'position', type: 'text' },
  { field: 'engagementType', title: 'engagementType', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (v: boolean) => (v ? 'Yes' : 'No'),
  },
];

/** Column definitions for staff group list */
export const staffGroupColumns: tableColumn<staffGroup>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (v: boolean) => (v ? 'Yes' : 'No'),
  },
];

/** Column definitions for shift list */
export const shiftColumns: tableColumn<shift>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'type', title: 'type', type: 'text' },
  { field: 'dateStart', title: 'dateStart', type: 'date' },
  { field: 'dateEnd', title: 'dateEnd', type: 'date' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (v: boolean) => (v ? 'Yes' : 'No'),
  },
];
