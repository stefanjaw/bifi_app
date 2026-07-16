import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Route definitions for clinical-orders feature (order-sets, orders, order-maintenances) */
export const CLINICAL_ORDERS_ROUTES: Routes = [
  {
    path: 'order-sets',
    canActivate: [permissionGuard],
    data: { resource: 'order-sets/list' },
    loadComponent: () =>
      import('../features/order-sets-list/order-sets-list').then(m => m.OrderSetsList),
  },
  {
    path: 'orders',
    canActivate: [permissionGuard],
    data: { resource: 'orders/list' },
    loadComponent: () => import('../features/orders-list/orders-list').then(m => m.OrdersList),
  },
  {
    path: 'order-maintenances',
    canActivate: [permissionGuard],
    data: { resource: 'order-maintenances/list' },
    loadComponent: () =>
      import('../features/order-maintenances-list/order-maintenances-list').then(
        m => m.OrderMaintenancesList
      ),
  },
];
