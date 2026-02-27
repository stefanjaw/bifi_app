import { inject } from '@angular/core';
import { CRM_ROUTES } from '../../routes/crm.routes';
import { CRM_STAGES_ROUTES } from '../../modules/crm-stages';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { PrimeIcons } from 'primeng/api';

export function initializeCrm() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.BRIEFCASE,
        routerLink: ['/crm'],
        label: 'CRM',
        resource: 'crm/menu',
        showInMainMenu: true,
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'CRM',
        resource: 'crm/settings/menu',
        items: [
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/settings/crm/crm-stages'],
            label: 'CRM Stages',
            resource: 'crm-stages/menu',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    basePath: 'crm',
    newRouting: CRM_ROUTES,
  });

  mainRoutingManager.addRouting({
    newRouting: {
      path: 'crm',
      children: [
        {
          path: 'crm-stages',
          children: CRM_STAGES_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });
}
