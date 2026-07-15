import { inject } from '@angular/core';
import {
  EMAIL_MARKETING_ROUTES,
  EMAIL_MARKETING_SETTINGS_ROUTES,
} from '../../routes/email-marketing.routes';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { PrimeIcons } from 'primeng/api';

export function initializeEmailMarketing() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.ENVELOPE,
        routerLink: ['/email-marketing'],
        label: 'email-marketing.nav.emailMarketing',
        resource: 'email-marketing/menu',
        scope: 'email-marketing',
        showInMainMenu: true,
        items: [
          {
            icon: PrimeIcons.CHART_BAR,
            routerLink: ['/email-marketing/dashboard'],
            label: 'email-marketing.nav.dashboard',
            resource: 'email-marketing/dashboard/menu',
            scope: 'email-marketing',
          },
          {
            icon: PrimeIcons.SEND,
            routerLink: ['/email-marketing/campaigns'],
            label: 'email-marketing.nav.campaigns',
            resource: 'email-campaigns/menu',
            scope: 'email-marketing',
          },
          {
            icon: PrimeIcons.PALETTE,
            routerLink: ['/email-marketing/templates'],
            label: 'email-marketing.nav.templates',
            resource: 'email-templates/menu',
            scope: 'email-marketing',
          },
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/email-marketing/lists'],
            label: 'email-marketing.nav.mailingLists',
            resource: 'mailing-lists/menu',
            scope: 'email-marketing',
          },
          {
            icon: PrimeIcons.USERS,
            routerLink: ['/email-marketing/subscribers'],
            label: 'email-marketing.nav.subscribers',
            resource: 'subscribers/menu',
            scope: 'email-marketing',
          },
        ],
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'email-marketing.nav.emailMarketing',
        resource: 'email-marketing/settings/menu',
        scope: 'email-marketing',
        items: [
          {
            icon: PrimeIcons.COG,
            routerLink: ['/settings/email-marketing/config'],
            label: 'email-marketing.nav.configuration',
            resource: 'email-settings/menu',
            scope: 'email-marketing',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    basePath: 'email-marketing',
    newRouting: EMAIL_MARKETING_ROUTES,
  });

  mainRoutingManager.addRouting({
    newRouting: {
      path: 'email-marketing',
      children: EMAIL_MARKETING_SETTINGS_ROUTES,
    },
    childOf: 'settings',
  });
}
