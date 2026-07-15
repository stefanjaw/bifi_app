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
import { provideMenuItems, withLibraryInterceptors } from '@avalantec/base-app/routing';
import { Noir } from './primeng.preset';
import { provideAssetRoster } from '@avalantec/asset-roster';
import { provideWebsite } from '@avalantec/website';
import { provideTasks } from '@avalantec/tasks';
import { provideAduanix } from '@avalantec/aduanix';
import { provideSales } from '@avalantec/sales';
import { providePurchases } from '@avalantec/purchases';
import { provideInventory } from '@avalantec/inventory';
import { provideAccounting } from '@avalantec/accounting';
import { provideEmailMarketing } from '@avalantec/email-marketing';
import { provideHelpdesk } from '@avalantec/helpdesk';
import { provideCalendar } from '@avalantec/calendar';
import { provideProjects } from '@avalantec/projects';
import { provideL10nCrEinvoice } from '@avalantec/l10n_cr_einvoice';
import { provideTranslationRoot } from '@avalantec/base-app/i18n';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: LIBRARY_CONFIG,
      useValue: {
        apiURL: environment.apiURL,
        rbacEnable: false,
        bugReportingURL: environment.bugReportingURL,
      },
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
    provideWebsite(),
    provideTasks(),
    provideAduanix(),
    provideSales(),
    providePurchases(),
    provideInventory(),
    provideAccounting(),
    provideEmailMarketing(),
    provideHelpdesk(),
    provideProjects(),
    provideL10nCrEinvoice(),
    provideTranslationRoot(),
    provideMenuItems(),
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
