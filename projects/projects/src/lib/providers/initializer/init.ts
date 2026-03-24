import { inject } from '@angular/core';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { PROJECTS_ROUTES } from '../../routes/projects.routes';
import { PrimeIcons } from 'primeng/api';

export function initializeProjects() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.FOLDER,
        routerLink: ['/projects'],
        label: 'Projects',
        resource: 'projects/menu',
        showInMainMenu: true,
      },
    },
  ]);

  mainRoutingManager.addRouting({
    basePath: 'projects',
    newRouting: PROJECTS_ROUTES,
  });
}
