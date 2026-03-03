import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const PURCHASES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders',
  },
  {
    path: 'suppliers',
    canActivate: [authGuard],
    loadComponent: () => import('../features/suppliers/suppliers').then(c => c.Suppliers),
  },
  {
    path: 'suppliers/:id',
    canActivate: [authGuard],
    loadComponent: () => import('../features/supplier-detail/supplier-detail').then(c => c.SupplierDetail),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('../features/purchase-orders/purchase-orders').then(c => c.PurchaseOrders),
  },
  {
    path: 'orders/new',
    canActivate: [authGuard],
    loadComponent: () => import('../features/purchase-order-detail/purchase-order-detail').then(c => c.PurchaseOrderDetail),
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () => import('../features/purchase-order-detail/purchase-order-detail').then(c => c.PurchaseOrderDetail),
  },
  {
    path: 'pipeline',
    canActivate: [authGuard],
    loadComponent: () => import('../features/purchase-pipeline/purchase-pipeline').then(c => c.PurchasePipeline),
  },
];
