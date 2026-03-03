import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'warehouses',
  },
  {
    path: 'warehouses',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/warehouses-list/warehouses-list').then(
        (c) => c.WarehousesList
      ),
  },
  {
    path: 'warehouses/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/warehouse-form/warehouse-form').then(
        (c) => c.WarehouseForm
      ),
  },
  {
    path: 'warehouses/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/warehouse-detail/warehouse-detail').then(
        (c) => c.WarehouseDetail
      ),
  },
  {
    path: 'warehouses/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/warehouse-form/warehouse-form').then(
        (c) => c.WarehouseForm
      ),
  },
  {
    path: 'locations/new/:warehouseId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/location-form/location-form').then(
        (c) => c.LocationForm
      ),
  },
  {
    path: 'locations/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/location-form/location-form').then(
        (c) => c.LocationForm
      ),
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/products-list/products-list').then(
        (c) => c.ProductsList
      ),
  },
  {
    path: 'products/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/product-form/product-form').then(
        (c) => c.ProductForm
      ),
  },
  {
    path: 'products/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/product-detail/product-detail').then(
        (c) => c.ProductDetail
      ),
  },
  {
    path: 'products/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/product-form/product-form').then(
        (c) => c.ProductForm
      ),
  },
  {
    path: 'movements',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/movements-list/movements-list').then(
        (c) => c.MovementsList
      ),
  },
  {
    path: 'movements/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/movement-form/movement-form').then(
        (c) => c.MovementForm
      ),
  },
  {
    path: 'transfer',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/transfer/transfer').then((c) => c.Transfer),
  },
  {
    path: 'uom-categories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/uom-categories-list/uom-categories-list').then(
        (c) => c.UomCategoriesList
      ),
  },
  {
    path: 'uom-categories/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/uom-category-form/uom-category-form').then(
        (c) => c.UomCategoryForm
      ),
  },
  {
    path: 'uom-categories/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/uom-category-form/uom-category-form').then(
        (c) => c.UomCategoryForm
      ),
  },
  {
    path: 'uoms',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/uoms-list/uoms-list').then((c) => c.UomsList),
  },
  {
    path: 'uoms/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/uom-form/uom-form').then((c) => c.UomForm),
  },
  {
    path: 'uoms/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/uom-form/uom-form').then((c) => c.UomForm),
  },
];
