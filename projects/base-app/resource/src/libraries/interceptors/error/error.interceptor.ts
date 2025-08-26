// src/app/core/interceptors/error.interceptor.ts
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { appError } from '@avalantec/base-app/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    catchError((error: unknown) => {
      let processedError: appError;

      // 1. Manejar errores de HTTP (4xx, 5xx)
      if (error instanceof HttpErrorResponse) {
        // Si el error es de tipo HttpErrorResponse, extraer el cuerpo del error (body response)
        const errorBody = error.error;
        let parsedErrorMessage: string | null = null;

        if (typeof errorBody === 'object') {
          // Si el cuerpo del error es un objeto, extraer el mensaje
          if (errorBody.message) parsedErrorMessage = errorBody.message;
        }

        processedError = {
          status: error.status,
          message: parsedErrorMessage || error.message,
        };
      }
      // 2. Manejar errores de Zod (del interceptor)
      // else if (isZodValidationError(error)) {
      //   processedError = {
      //     status: 0,
      //     message: 'Invalid data format received from server.',
      //   };
      // }
      // 3. Otros errores inesperados
      else {
        processedError = {
          status: 0,
          message: 'An unexpected error occurred',
        };
      }

      // Re-lanzar el error procesado
      return throwError(() => processedError);
    })
  );
};

// Helper para verificar si es un error Zod
// function isZodValidationError(error: unknown): error is ZodInterceptorError {
//   return error instanceof ZodInterceptorError;
// }
