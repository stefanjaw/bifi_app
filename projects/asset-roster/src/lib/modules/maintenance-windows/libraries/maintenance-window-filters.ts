import { filter } from '@avalantec/base-app/resource';
import { maintenanceWindow } from '../interfaces/maintenance-window';

export const maintenanceWindowFilters: filter<maintenanceWindow>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'daysBefore',
    type: 'number',
  },
  {
    field: 'daysAfter',
    type: 'number',
  },
  {
    field: 'recurrency',
    type: 'string',
  },
];
