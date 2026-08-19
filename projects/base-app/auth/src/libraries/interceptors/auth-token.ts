import { HttpContextToken, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { LIB_AUTH_SERVICE } from '../providers/auth-service-provider';
import { AUTH_ENABLED_TOKEN } from '../providers/enable-auth-provider';

export const HTTP_INCLUE_AUTH_TOKEN = new HttpContextToken<boolean>(() => true);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(HTTP_INCLUE_AUTH_TOKEN)) return next(req);
  const authEnabled = inject(AUTH_ENABLED_TOKEN, {
    optional: true,
  });

  if (!authEnabled) return next(req);

  // Only attach the Firebase ID token to requests targeting the backend API.
  // Without this check, the Authorization header would be sent to every
  // external origin the app contacts, leaking a credential that authenticates
  // as the user against the backend. (H9)
  const apiURL = inject(LIBRARY_CONFIG, { optional: true })?.apiURL ?? '';
  const isBackendUrl = apiURL.length > 0 && req.url.startsWith(apiURL);
  if (!isBackendUrl) return next(req);

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
