import { tableColumn } from '@avalantec/base-app/resource';
import { maintenanceWindow } from '../interfaces/maintenance-window';

export const maintenanceWindowColumns: tableColumn<maintenanceWindow>[] = [
  {
    field: 'name',
    title: 'Role Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'daysBefore',
    title: 'Days Before',
    type: 'number',
    sortable: true,
  },
  {
    field: 'daysAfter',
    title: 'Days After',
    type: 'number',
    sortable: true,
  },
  {
    field: 'recurrency',
    title: 'Recurrency',
    type: 'text',
    sortable: true,
  },
];
