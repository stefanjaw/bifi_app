import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { Noir } from 'projects/asset-roaster-demo/src/app/primeng.preset';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { MessageService } from 'primeng/api';
import { authTokenInterceptor, provideAppAuth } from '@avalantec/base-app/auth';
import { environment } from '../environments/environment.development';
import { CrudUsers } from '@avalantec/base-app/settings';
import { APP_AUTH_SERVICE } from '@avalantec/asset-roaster/modules/user/user';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: LIBRARY_CONFIG,
      useValue: { apiURL: 'http://localhost:8080/api/' },
    },
    providePrimeNG({
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    provideHttpClient(withFetch(), withInterceptors([authTokenInterceptor])),
    provideAppAuth({
      authProvider: {
        type: 'FIREBASE',
        token: APP_AUTH_SERVICE,
        config: environment.firebaseConfig,
      },
      backendAuth: CrudUsers,
    }),
    MessageService,
  ],
};
