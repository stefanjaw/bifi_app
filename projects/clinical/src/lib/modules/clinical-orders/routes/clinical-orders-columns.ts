import { tableColumn } from '@avalantec/base-app/resource';
import { orderSet, order, orderMaintenance } from '../interfaces/clinical-orders';

/** Table column definitions for order sets */
export const orderSetColumns: tableColumn<orderSet>[] = [
  { field: 'byName', title: 'byName', type: 'text' },
  { field: 'type', title: 'type', type: 'text' },
  { field: 'priority', title: 'priority', type: 'text' },
  { field: 'state', title: 'state', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Table column definitions for orders */
export const orderColumns: tableColumn<order>[] = [
  { field: 'title', title: 'title', type: 'text' },
  { field: 'type', title: 'type', type: 'text' },
  { field: 'status', title: 'status', type: 'text' },
  { field: 'priority', title: 'priority', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Table column definitions for order maintenances */
export const orderMaintenanceColumns: tableColumn<orderMaintenance>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'color', title: 'color', type: 'text' },
];
