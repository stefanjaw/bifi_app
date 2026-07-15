import { inject, InjectionToken } from '@angular/core';
import { IAuthService } from '../../interfaces/auth-service';
import { user } from '@avalantec/base-app/interfaces';

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

/**
 * Injects the application-wide auth service instance.
 * Provides strong typing via the generic parameter.
 */
export function injectAuthService<
  AuthService extends IAuthService<user> = IAuthService<user>,
>(): AuthService {
  return inject(LIB_AUTH_SERVICE) as AuthService;
}
