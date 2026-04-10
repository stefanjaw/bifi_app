import { CanActivateFn } from '@angular/router';
import { injectAuthService } from '../libraries/providers/auth-service-provider';
import { resource } from '@avalantec/base-app/interfaces';

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
