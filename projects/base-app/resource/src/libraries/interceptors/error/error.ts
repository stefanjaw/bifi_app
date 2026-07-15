// src/app/core/interceptors/error.ts
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { appError } from '@avalantec/base-app/core';
import { TranslationService } from '@avalantec/base-app/i18n';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    catchError((error: unknown) => {
      let processedError: appError;

      if (error instanceof HttpErrorResponse) {
        const errorBody = error.error;
        let parsedErrorMessage: string | null = null;

        if (typeof errorBody === 'object') {
          // Si hay un array de errores de validación, los formatea
          if (Array.isArray(errorBody.errors) && errorBody.errors.length > 0) {
            parsedErrorMessage = errorBody.errors
              .map(
                (err: any) =>
                  `${err.path}: ${Array.isArray(err.messages) ? err.messages.join(', ') : err.messages}`
              )
              .join('\n');
          } else if (errorBody.message) {
            parsedErrorMessage = errorBody.message;
          }
        }

        processedError = {
          status: error.status,
          message: parsedErrorMessage || error.message,
        };
      } else {
        const translationService = inject(TranslationService);
        processedError = {
          status: 0,
          message: translationService.translate(
            'interceptor.unexpectedError',
            {},
            'base-app/resource'
          ),
        };
      }

      return throwError(() => processedError);
    })
  );
};

// Helper para verificar si es un error Zod
// function isZodValidationError(error: unknown): error is ZodInterceptorError {
//   return error instanceof ZodInterceptorError;
// }
