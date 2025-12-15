import { inject } from '@angular/core';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { TASKS_ROUTES } from '../../modules';
import { PrimeIcons } from 'primeng/api';

export function initializeTasks() {
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
        routerLink: ['/tasks'],
        label: 'Tasks',
        resource: 'tasks/menu',
        showInMainMenu: true,
      },
    },
  ]);

  // main routing
  mainRoutingManager.addRouting({
    newRouting: TASKS_ROUTES,
    basePath: 'tasks',
  });
}
