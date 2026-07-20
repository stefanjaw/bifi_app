import { filter } from '@avalantec/base-app/resource';
import { staff, staffGroup, shift } from '../interfaces/staff';

/** Filter configuration for staff list */
export const staffFilters: filter<staff>[] = [
  { field: 'personnelId', type: 'string' },
  { field: 'department', type: 'string' },
  { field: 'position', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for staff group list */
export const staffGroupFilters: filter<staffGroup>[] = [
  { field: 'name', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for shift list */
export const shiftFilters: filter<shift>[] = [
  { field: 'type', type: 'string' },
  { field: 'dateStart', type: 'date' },
  { field: 'active', type: 'boolean' },
];
