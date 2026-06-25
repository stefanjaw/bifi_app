import {
  HttpFeature,
  HttpFeatureKind,
  HttpInterceptorFn,
  withInterceptors,
} from '@angular/common/http';
import { AUTH_HTTP_INTERCEPTORS } from '@avalantec/base-app/auth';
import { errorInterceptor, notificationInterceptor } from '@avalantec/base-app/resource';
import { badgeRefreshInterceptor } from '../interceptors/badge-refresh';

interface InterceptorsConfig {
  auth?: boolean;
  customInterceptors?: HttpInterceptorFn[];
}

export function withLibraryInterceptors({
  auth = true,
  customInterceptors = [],
}: InterceptorsConfig = {}): HttpFeature<HttpFeatureKind.Interceptors> {
  const interceptors = [errorInterceptor, notificationInterceptor, badgeRefreshInterceptor];

  if (auth) interceptors.push(...AUTH_HTTP_INTERCEPTORS);

  interceptors.push(...customInterceptors);

  return withInterceptors(interceptors);
}
