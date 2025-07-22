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
      import('../features/products-list/products-list.component').then(
        m => m.ProductsListComponent
      ),
  },
  {
    path: 'maintenance',
    loadComponent: () =>
      import('../features/product-maintenance/product-maintenance').then(m => m.ProductMaintenance),
  },
];
