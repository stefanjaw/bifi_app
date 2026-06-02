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
        label: 'Email Marketing',
        resource: 'email-marketing/menu',
        showInMainMenu: true,
        items: [
          {
            icon: PrimeIcons.CHART_BAR,
            routerLink: ['/email-marketing/dashboard'],
            label: 'Dashboard',
            resource: 'email-marketing/dashboard/menu',
          },
          {
            icon: PrimeIcons.SEND,
            routerLink: ['/email-marketing/campaigns'],
            label: 'Campaigns',
            resource: 'email-campaigns/menu',
          },
          {
            icon: PrimeIcons.PALETTE,
            routerLink: ['/email-marketing/templates'],
            label: 'Templates',
            resource: 'email-templates/menu',
          },
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/email-marketing/lists'],
            label: 'Mailing Lists',
            resource: 'mailing-lists/menu',
          },
          {
            icon: PrimeIcons.USERS,
            routerLink: ['/email-marketing/subscribers'],
            label: 'Subscribers',
            resource: 'subscribers/menu',
          },
        ],
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'Email Marketing',
        resource: 'email-marketing/settings/menu',
        items: [
          {
            icon: PrimeIcons.COG,
            routerLink: ['/settings/email-marketing/config'],
            label: 'Configuration',
            resource: 'email-settings/menu',
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
