// src/app/core/interceptors/notification.interceptor.ts
import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  HTTP_NOTIFICATION_CONFIG_TOKEN,
  NotificationConfig,
  TranslateKey,
} from './notification.context';
import { inject } from '@angular/core';
import { ToastManager } from '@avalantec/base-app/core';

export const notificationInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const config = req.context.get(HTTP_NOTIFICATION_CONFIG_TOKEN);
  const toastService = inject(ToastManager);

  // Si no hay configuración, ignorar el interceptor
  if (!config) return next(req);

  const {
    loading: loadingMessage,
    success: successMessage,
    error: errorMessage,
  } = getMessages(config);

  // Mostrar toast de "loading" (infinito)
  const toastId = loadingMessage
    ? toastService.showLoading(loadingMessage, {
        duration: Number.POSITIVE_INFINITY,
      })
    : undefined;

  // Extensión del interceptor anterior (notification.interceptor.ts)
  return next(req).pipe(
    tap({
      next: ev => {
        // Éxito: Mostrar toast de éxito
        if (ev.type === HttpEventType.Response && ev.ok) {
          if (successMessage) {
            toastService.showSuccess(successMessage, {
              id: toastId,
              duration: 3000,
            });
          }
        }
      },
      error: err => {
        if (errorMessage) {
          const message =
            errorMessage?.replace('{{ message }}', err.message) ||
            err.message ||
            'An error occurred';
          toastService.showError(message, { id: toastId, duration: 5000 });
        }
      },
    })
  );
};

function getMessages(config: NotificationConfig) {
  let success: string | undefined = undefined;
  let error: string | undefined = undefined;
  let loading: string | undefined = undefined;

  if (config instanceof TranslateKey) {
    // const data = transloco.translateObject(config.key, config.params, config.scope);
    // console.log('translated object notifications', data);
    // if (typeof data === 'object') {
    //   if (data.success) success = data.success;
    //   if (data.error) error = data.error;
    //   if (data.loading) loading = data.loading;
    // } else {
    //   console.log('Could not find translation for key', config);
    // }
  } else {
    if (config.successMessage) success = config.successMessage;

    if (config.errorMessage) error = config.errorMessage;

    if (config.loadingMessage) loading = config.loadingMessage;
  }

  return { success, error, loading };
}
