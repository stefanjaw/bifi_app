import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Noir } from 'projects/asset-roaster-demo/src/app/primeng.preset';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { MessageService } from 'primeng/api';
import { provideAppAuth } from '@avalantec/base-app/auth';
import { APP_AUTH_SERVICE } from '@avalantec/asset-roaster/providers';
import { environment } from '../environments/environment.development';
import { CrudUsers } from '@avalantec/asset-roaster';

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
          darkModeSelector: false || 'none',
        },
      },
    }),
    provideHttpClient(withFetch()),
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
