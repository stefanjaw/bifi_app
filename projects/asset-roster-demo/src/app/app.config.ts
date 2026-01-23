import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { MessageService } from 'primeng/api';
import { APP_AUTH_SERVICE, provideAppAuth } from '@avalantec/base-app/auth';
import { environment } from '../environments/environment.development';
import { CrudUsers } from '@avalantec/base-app/users';
import { provideAssetRoster } from '@avalantec/asset-roster';
import { withLibraryInterceptors } from '@avalantec/base-app/routing';
import { provideCalendar } from '@avalantec/calendar';
import { provideCRM } from '@avalantec/crm';
import { Noir } from './primeng.preset';
import { provideWebsite } from '@avalantec/website';
import { provideTasks } from '@avalantec/tasks';
import { provideAduanix } from '@avalantec/aduanix';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: LIBRARY_CONFIG,
      useValue: { apiURL: 'http://localhost:8080/api', rbacEnable: true },
    },
    providePrimeNG({
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    provideHttpClient(
      withFetch(),
      withLibraryInterceptors({
        auth: true,
        customInterceptors: [],
      })
    ),
    provideAssetRoster(),
    provideCalendar(),
    provideCRM(),
    provideWebsite(),
    provideTasks(),
    provideAduanix(),
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
