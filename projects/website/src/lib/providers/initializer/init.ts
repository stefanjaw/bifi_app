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
        label: 'Website',
        icon: 'pi pi-globe',
        routerLink: ['/website'],
        showInMainMenu: true,
      },
    },
    {
      item: {
        id: 'website',
        label: 'Website',
        icon: 'pi pi-globe',
        items: [
          {
            icon: 'pi pi-file-pdf',
            routerLink: ['/settings/templates'],
            label: 'Templates',
            resource: 'templates/menu',
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
