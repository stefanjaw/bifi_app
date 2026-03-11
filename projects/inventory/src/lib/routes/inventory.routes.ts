import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'warehouses',
  },
  {
    path: 'warehouses',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/warehouses-list/warehouses-list').then(
        (c) => c.WarehousesList
      ),
    data: { resource: 'inventory/warehouses/list' },
  },
  {
    path: 'warehouses/new',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/warehouse-form/warehouse-form').then(
        (c) => c.WarehouseForm
      ),
    data: { resource: 'inventory/warehouses/create' },
  },
  {
    path: 'warehouses/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/warehouse-detail/warehouse-detail').then(
        (c) => c.WarehouseDetail
      ),
    data: { resource: 'inventory/warehouses/read' },
  },
  {
    path: 'warehouses/:id/edit',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/warehouse-form/warehouse-form').then(
        (c) => c.WarehouseForm
      ),
    data: { resource: 'inventory/warehouses/update' },
  },
  {
    path: 'locations/new/:warehouseId',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/location-form/location-form').then(
        (c) => c.LocationForm
      ),
    data: { resource: 'inventory/locations/create' },
  },
  {
    path: 'locations/:id/edit',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/location-form/location-form').then(
        (c) => c.LocationForm
      ),
    data: { resource: 'inventory/locations/update' },
  },
  {
    path: 'products',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/products-list/products-list').then(
        (c) => c.ProductsList
      ),
    data: { resource: 'inventory/products/list' },
  },
  {
    path: 'products/new',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/product-form/product-form').then(
        (c) => c.ProductForm
      ),
    data: { resource: 'inventory/products/create' },
  },
  {
    path: 'products/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/product-detail/product-detail').then(
        (c) => c.ProductDetail
      ),
    data: { resource: 'inventory/products/read' },
  },
  {
    path: 'products/:id/edit',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/product-form/product-form').then(
        (c) => c.ProductForm
      ),
    data: { resource: 'inventory/products/update' },
  },
  {
    path: 'movements',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/movements-list/movements-list').then(
        (c) => c.MovementsList
      ),
    data: { resource: 'inventory/movements/list' },
  },
  {
    path: 'movements/new',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/movement-form/movement-form').then(
        (c) => c.MovementForm
      ),
    data: { resource: 'inventory/movements/create' },
  },
  {
    path: 'transfer',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/transfer/transfer').then((c) => c.Transfer),
    data: { resource: 'inventory/transfer/create' },
  },
  {
    path: 'uom-categories',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/uom-categories-list/uom-categories-list').then(
        (c) => c.UomCategoriesList
      ),
    data: { resource: 'inventory/uom-categories/list' },
  },
  {
    path: 'uom-categories/new',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/uom-category-form/uom-category-form').then(
        (c) => c.UomCategoryForm
      ),
    data: { resource: 'inventory/uom-categories/create' },
  },
  {
    path: 'uom-categories/:id/edit',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/uom-category-form/uom-category-form').then(
        (c) => c.UomCategoryForm
      ),
    data: { resource: 'inventory/uom-categories/update' },
  },
  {
    path: 'uoms',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/uoms-list/uoms-list').then((c) => c.UomsList),
    data: { resource: 'inventory/uoms/list' },
  },
  {
    path: 'uoms/new',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/uom-form/uom-form').then((c) => c.UomForm),
    data: { resource: 'inventory/uoms/create' },
  },
  {
    path: 'uoms/:id/edit',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/uom-form/uom-form').then((c) => c.UomForm),
    data: { resource: 'inventory/uoms/update' },
  },
];
