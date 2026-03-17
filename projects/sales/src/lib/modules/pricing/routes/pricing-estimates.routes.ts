import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const PRICING_ESTIMATES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'history',
  },
  {
    path: 'new',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/pricing-estimate-form/pricing-estimate-form').then(
        (c) => c.PricingEstimateFormComponent
      ),
    data: { resource: 'pricing-estimates/create' },
  },
  {
    path: 'history',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/pricing-estimate-list/pricing-estimate-list').then(
        (c) => c.PricingEstimateListComponent
      ),
    data: { resource: 'pricing-estimates/list' },
  },
  {
    path: ':id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/pricing-estimate-output/pricing-estimate-output').then(
        (c) => c.PricingEstimateOutputComponent
      ),
    data: { resource: 'pricing-estimates/read' },
  },
];
