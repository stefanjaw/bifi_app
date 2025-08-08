import { InjectionToken } from '@angular/core';
import { IAuthService } from '../../interfaces/auth-service';
import { user } from '@avalantec/base-app/settings';

export let LIB_AUTH_SERVICE = new InjectionToken<IAuthService<user>>('APP_AUTH_SERVICE');

/**
 * Creates a strongly typed auth provider token for injection
 *
 * @returns The strongly typed auth provider token
 */
export const createAuthServiceToken = <AuthService extends IAuthService<user>>() => {
  // Returns the strongly typed auth provider token
  const token = new InjectionToken<AuthService>('APP_AUTH_SERVICE');
  LIB_AUTH_SERVICE = token;
  return token;
};
