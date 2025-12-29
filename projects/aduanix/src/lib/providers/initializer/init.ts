import { inject } from '@angular/core';
import { ADUANIX_ROUTES } from '@avalantec/aduanix/routes/aduanix.routes';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { PrimeIcons } from 'primeng/api';

export function initializeAduanix() {
  initializeMenu();
}

function initializeMenu() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  // main menu
  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.OBJECTS_COLUMN,
        routerLink: ['/aduanix'],
        label: 'Aduanix',
        resource: 'aduanix/menu',
        showInMainMenu: true,
      },
    },
  ]);

  // main routing
  mainRoutingManager.addRouting({
    basePath: 'aduanix',
    newRouting: ADUANIX_ROUTES,
  });
}
