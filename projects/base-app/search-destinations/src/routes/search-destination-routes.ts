import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const SEARCH_DESTINATION_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/search-destinations-list/search-destinations-list').then(
        m => m.SearchDestinationsList
      ),
    data: { resource: 'search-destinations/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/search-destination-form/search-destination-form').then(
        m => m.SearchDestinationFormComponent
      ),
    data: { resource: 'search-destinations/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/search-destination-form/search-destination-form').then(
        m => m.SearchDestinationFormComponent
      ),
    data: { resource: 'search-destinations/update' },
  },
];
