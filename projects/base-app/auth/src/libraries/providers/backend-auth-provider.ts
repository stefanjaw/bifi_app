import { InjectionToken } from '@angular/core';
import { IBackendAuthService } from '../../interfaces/backend-auth-service';

export const APP_BACKEND_AUTH_SERVICE = new InjectionToken<IBackendAuthService<any>>(
  'APP_BACKEND_AUTH_SERVICE'
);
