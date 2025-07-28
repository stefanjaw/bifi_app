import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('../features/products-list/products-list').then(
        m => m.ProductsList
      ),
  },
  {
    path: 'maintenance/:id',
    loadComponent: () =>
      import('../features/product-maintenance/product-maintenance').then(m => m.ProductMaintenance),
  },
];
