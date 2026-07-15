import { inject } from '@angular/core';
import { WEBSITE_ROUTES } from '../../routes/website-routes';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';

export function initializeWebsite() {
  initializeMenu();
}

function initializeMenu() {
  const mainRoutingManager = inject(MainRoutingManager);
  const mainMenuManager = inject(MainMenuManager);

  mainMenuManager.addItems([
    {
      item: {
        id: 'website',
        label: 'website',
        icon: 'pi pi-globe',
        routerLink: ['/website'],
        showInMainMenu: true,
        scope: 'website',
      },
    },
    {
      item: {
        id: 'website',
        label: 'website',
        icon: 'pi pi-globe',
        scope: 'website',
        items: [
          {
            icon: 'pi pi-file-pdf',
            routerLink: ['/settings/templates'],
            label: 'templates',
            resource: 'templates/menu',
            scope: 'website',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    newRouting: WEBSITE_ROUTES,
    basePath: 'website',
  });
}
