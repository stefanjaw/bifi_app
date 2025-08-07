import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../services/auth-state';

/**
 * Guard that checks if the user is authenticated and redirects to the login page if not.
 * @returns `true` if the user is authenticated, or a redirect to the login page if not.
 */
export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthState);
  const router = inject(Router);

  // Check if the user is authenticated and redirect to the login page if not
  if (!authState.session()) {
    return router.parseUrl('/auth/signin');
  }

  return true;
};
