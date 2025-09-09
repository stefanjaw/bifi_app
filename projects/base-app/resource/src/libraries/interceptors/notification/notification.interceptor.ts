// src/app/core/interceptors/notification.interceptor.ts
import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { HTTP_NOTIFICATION_CONFIG_TOKEN } from './notification.context';
import { inject } from '@angular/core';
import { ToastManager } from '@avalantec/base-app/core';
import { NotificationMessageResolver } from '../../../services/notification-message-resolver';

export const notificationInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const config = req.context.get(HTTP_NOTIFICATION_CONFIG_TOKEN);
  const toastService = inject(ToastManager);
  const notificationMessageResolver = inject(NotificationMessageResolver);

  // Maneja la solicitud si es POST, PUT, DELETE o PATCH, o si recibe una configuración
  const canHandleRequest =
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'DELETE' ||
    req.method === 'PATCH' ||
    (config !== null && config.enable !== false);

  if (!canHandleRequest) return next(req);

  const {
    loading: loadingMessage,
    success: successMessage,
    error: errorMessage,
  } = notificationMessageResolver.resolveMessages({
    config: config?.notification,
    elementName: config?.elementName || 'element',
    method: req.method,
  });

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
        let backendMessage = '';

        // Procesa errores de validación tipo array
        if (err?.error && Array.isArray(err.error.errors) && err.error.errors.length > 0) {
          backendMessage = err.error.errors
            .map(
              (e: any) =>
                `${e.path}: ${Array.isArray(e.messages) ? e.messages.join(', ') : e.messages}`
            )
            .join('\n');
        } else if (err?.error?.message) {
          backendMessage = err.error.message;
        } else if (err?.message) {
          backendMessage = err.message;
        } else {
          backendMessage = 'An error occurred';
        }

        const message = errorMessage?.replace('{{ message }}', backendMessage) || backendMessage;

        toastService.showError(message, { id: toastId, duration: 5000 });
      },
    })
  );
};
