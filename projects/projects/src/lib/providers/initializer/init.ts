import { inject } from '@angular/core';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { PROJECTS_ROUTES } from '../../routes/projects.routes';
import { PROJECT_STAGES_ROUTES } from '../../modules/project-stages';
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
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'Projects',
        resource: 'projects/settings/menu',
        items: [
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/settings/projects/project-stages'],
            label: 'Project Stages',
            resource: 'project-stages/menu',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    basePath: 'projects',
    newRouting: PROJECTS_ROUTES,
  });

  mainRoutingManager.addRouting({
    newRouting: {
      path: 'projects',
      children: [
        {
          path: 'project-stages',
          children: PROJECT_STAGES_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });
}
