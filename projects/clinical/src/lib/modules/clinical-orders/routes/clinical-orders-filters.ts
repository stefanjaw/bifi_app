import { filter } from '@avalantec/base-app/resource';
import { orderSet, order, orderMaintenance } from '../interfaces/clinical-orders';

/** Filter definitions for order sets */
export const orderSetFilters: filter<orderSet>[] = [
  { field: 'type', type: 'string' },
  { field: 'state', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter definitions for orders */
export const orderFilters: filter<order>[] = [
  { field: 'type', type: 'string' },
  { field: 'status', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter definitions for order maintenances */
export const orderMaintenanceFilters: filter<orderMaintenance>[] = [
  { field: 'name', type: 'string' },
];
