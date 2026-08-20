import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

/**
 * Self-service API keys routes. Creation happens via a dialog opened from the
 * list (no create/edit routes), and keys may only be created or revoked, so only
 * the lazy `list` route is needed. Guarded with `authGuard` only — each user
 * manages their own keys, and ownership is enforced server-side (no permissionGuard).
 */
export const API_KEY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [authGuard],
    loadComponent: () => import('../features/api-keys-list/api-keys-list').then(m => m.ApiKeysList),
    data: { resource: 'api-keys/list' },
  },
];
