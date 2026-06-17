import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NotificationCenterService } from '../services/notification-center.service';

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const badgeRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  if (!MUTATION_METHODS.has(req.method)) return next(req);

  const svc = inject(NotificationCenterService);
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse && event.status >= 200 && event.status < 300) {
        svc.refresh();
      }
    }),
  );
};
