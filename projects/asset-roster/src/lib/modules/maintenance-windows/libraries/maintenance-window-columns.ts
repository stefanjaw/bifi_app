import { tableColumn } from '@avalantec/base-app/resource';
import { maintenanceWindow } from '../interfaces/maintenance-window';

export const maintenanceWindowColumns: tableColumn<maintenanceWindow>[] = [
  {
    field: 'name',
    title: 'roleName',
    type: 'text',
    sortable: true,
  },
  {
    field: 'daysBefore',
    title: 'daysBefore',
    type: 'number',
    sortable: true,
  },
  {
    field: 'daysAfter',
    title: 'daysAfter',
    type: 'number',
    sortable: true,
  },
  {
    field: 'recurrency',
    title: 'recurrency',
    type: 'text',
    sortable: true,
  },
];
