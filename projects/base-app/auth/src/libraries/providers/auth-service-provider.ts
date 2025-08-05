import { InjectionToken } from '@angular/core';
import { IAuthService } from '../../interfaces/auth-service';

export const LIB_AUTH_SERVICE = new InjectionToken<IAuthService<any>>('APP_AUTH_SERVICE');

/**
 * Creates a strongly typed auth provider token for injection
 *
 * @returns The strongly typed auth provider token
 */
export const createAuthServiceToken = <AuthService extends IAuthService<any>>() => {
  // Returns the strongly typed auth provider token
  return new InjectionToken<AuthService>('APP_AUTH_SERVICE');
};
