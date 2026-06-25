import { CanActivateFn } from '@angular/router';
import { injectAuthService } from '../libraries/providers/auth-service-provider';
import { resource } from '@avalantec/base-app/interfaces';

/** Route guard that checks whether the current user has the required resource permission.
 *  Reads the `resource` key from route data and blocks navigation if the user lacks `view` access. */
export const permissionGuard: CanActivateFn = async route => {
  const authService = injectAuthService();
  const resource: resource = route.data['resource'];

  // Wait for the authentication state to be ready before checking permissions
  await authService.authStateReady;

  // create permission checker
  const user = authService.user();

  if (
    !user ||
    !authService.hasPermission({
      user: user,
      resource: resource,
      type: 'view',
      context: {},
    })
  )
    return false;

  return true;
};
