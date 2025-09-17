import { CanActivateFn } from '@angular/router';
import { injectAuthService } from '../libraries/providers/auth-service-provider';
import { permission } from '../interfaces/permission';
import { policyAction } from '@avalantec/base-app/core';

export const permissionGuard: CanActivateFn = async route => {
  const authService = injectAuthService();
  const permission: permission = route.data['permission'];

  const [resource, action] = permission.split(':');

  // create permission checker
  const user = authService.user();
  if (!user || !authService.hasPermission(user, resource, action as policyAction)) return false;

  return true;
};
