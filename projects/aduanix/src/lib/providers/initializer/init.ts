import { inject } from '@angular/core';
import { ADUANIX_ROUTES } from '../../routes/aduanix.routes';
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
        icon: PrimeIcons.TRUCK,
        routerLink: ['/aduanix'],
        label: 'menu.aduanix',
        scope: 'aduanix',
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
