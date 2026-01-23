import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LIB_AUTH_SERVICE } from '../libraries/providers/auth-service-provider';

/**
 * Guard that checks if the user is authenticated and redirects to the login page if not.
 * @returns `true` if the user is authenticated, or a redirect to the login page if not.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(LIB_AUTH_SERVICE);
  const router = inject(Router);

  // Wait for the authentication state to be ready
  await authService.authStateReady;

  // Check if the user is authenticated and redirect to the login page if not
  if (!authService.session()) {
    return router.parseUrl('/auth/signin');
  }

  // Check if the user has a valid session and redirect to the login page if not
  if (!authService.session()?.appUser.confirmed) {
    return router.parseUrl('/settings/profile');
  }

  return true;
};
