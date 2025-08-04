import { InjectionToken } from '@angular/core';
import { IAuthService } from '../../interfaces/auth-service';
import { Session } from '../../interfaces/user';

export let LIB_AUTH_SERVICE = new InjectionToken<IAuthService<any>>('APP_AUTH_SERVICE');

export const createAuthServiceToken = <TUser, TSession extends Session<TUser>>() => {
  const token = new InjectionToken<IAuthService<TUser, TSession>>('APP_AUTH_SERVICE');
  LIB_AUTH_SERVICE = token;
  return token;
};
