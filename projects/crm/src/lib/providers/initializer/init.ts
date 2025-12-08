import { inject } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { CRM_ROUTES } from '../../routes/crm.routes';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';

export function initializeCRM() {
  initializeMenu();
}

function initializeMenu() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  mainMenuManager.addItem({
    item: {
      icon: PrimeIcons.DISCORD,
      routerLink: ['/crm'],
      label: 'CRM',
      showInMainMenu: true,
      resource: 'leads/menu',
    },
  });

  mainRoutingManager.addRouting({
    newRouting: CRM_ROUTES,
    basePath: 'crm',
  });
}
