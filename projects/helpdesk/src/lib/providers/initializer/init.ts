import { inject } from '@angular/core';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { HELPDESK_ROUTES } from '../../routes/helpdesk.routes';
import { HELPDESK_STAGES_ROUTES } from '../../modules/helpdesk-stages';
import { PrimeIcons } from 'primeng/api';

export function initializeHelpdesk() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.INBOX,
        routerLink: ['/helpdesk'],
        label: 'Helpdesk',
        resource: 'helpdesk/menu',
        showInMainMenu: true,
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'Helpdesk',
        resource: 'helpdesk/settings/menu',
        items: [
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/settings/helpdesk/helpdesk-stages'],
            label: 'Helpdesk Stages',
            resource: 'helpdesk-stages/menu',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    basePath: 'helpdesk',
    newRouting: HELPDESK_ROUTES,
  });

  mainRoutingManager.addRouting({
    newRouting: {
      path: 'helpdesk',
      children: [
        {
          path: 'helpdesk-stages',
          children: HELPDESK_STAGES_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });
}
