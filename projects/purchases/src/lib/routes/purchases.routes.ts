import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const PURCHASES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders',
  },
  {
    path: 'suppliers',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/suppliers/suppliers').then(c => c.Suppliers),
    data: { resource: 'purchases/suppliers/list' },
  },
  {
    path: 'suppliers/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/supplier-detail/supplier-detail').then(c => c.SupplierDetail),
    data: { resource: 'purchases/suppliers/read' },
  },
  {
    path: 'orders',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/purchase-orders/purchase-orders').then(c => c.PurchaseOrders),
    data: { resource: 'purchases/orders/list' },
  },
  {
    path: 'orders/new',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/purchase-order-detail/purchase-order-detail').then(
        c => c.PurchaseOrderDetail
      ),
    data: { resource: 'purchases/orders/create' },
  },
  {
    path: 'orders/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/purchase-order-detail/purchase-order-detail').then(
        c => c.PurchaseOrderDetail
      ),
    data: { resource: 'purchases/orders/read' },
  },
  {
    path: 'pipeline',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/purchase-pipeline/purchase-pipeline').then(c => c.PurchasePipeline),
    data: { resource: 'purchases/pipeline/list' },
  },
];
