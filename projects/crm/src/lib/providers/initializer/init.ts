import { inject } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { CRM_ROUTES } from '../../routes/crm.routes';
import { MainMenuManager } from '@avalantec/base-app/routing';

export function initializeCRM() {
  initializeMenu();
}

function initializeMenu() {
  const mainMenuManager = inject(MainMenuManager);

  mainMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.DISCORD,
      routerLink: ['/crm'],
      label: 'CRM',
      showInMainMenu: true,
    },
    routes: CRM_ROUTES,
  });
}
