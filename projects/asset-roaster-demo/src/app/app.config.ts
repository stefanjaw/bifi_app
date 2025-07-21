import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LIBRARY_CONFIG } from '@avalantec/base-app';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Noir } from 'projects/asset-roaster-demo/src/app/primeng.preset';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
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
  ],
};
