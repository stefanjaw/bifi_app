import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_FRONTEND_AUTH_SERVICE } from '../..';

/**
 * Guard that checks if the user is authenticated and redirects to the login page if not.
 * @returns `true` if the user is authenticated, or a redirect to the login page if not.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(APP_FRONTEND_AUTH_SERVICE);
  const router = inject(Router);

  // Check if the user is authenticated and redirect to the login page if not
  if (!authService.isAuthenticated()) {
    return router.parseUrl('/auth/signin');
  }

  return true;
};
