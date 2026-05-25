import { HttpContextToken, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { LIB_AUTH_SERVICE } from '../providers/auth-service-provider';
import { AUTH_ENABLED_TOKEN } from '../providers/enable-auth-provider';

export const HTTP_INCLUE_AUTH_TOKEN = new HttpContextToken<boolean>(() => true);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(HTTP_INCLUE_AUTH_TOKEN)) return next(req);
  const authEnabled = inject(AUTH_ENABLED_TOKEN, {
    optional: true,
  });

  if (!authEnabled) return next(req);

  // Only include Firebase auth token on requests to the backend
  // if (!clientConfigService.isBackendUrl(url)) return next(req);

  const authService = inject(LIB_AUTH_SERVICE);

  return authService.idToken$.pipe(
    take(1),
    switchMap(token => {
      if (!token) return next(req);

      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(authReq);
    })
  );
};
