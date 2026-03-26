import { inject } from '@angular/core';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { TASKS_ROUTES } from '../../modules';
import { TASK_STAGES_ROUTES } from '../../modules/task-stages';
import { TASK_TYPES_ROUTES } from '../../modules/task-types';
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
        icon: PrimeIcons.LIST_CHECK,
        routerLink: ['/tasks'],
        label: 'Tasks',
        resource: 'tasks/menu',
        showInMainMenu: true,
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'Tasks',
        resource: 'tasks/settings/menu',
        items: [
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/settings/tasks/task-stages'],
            label: 'Task Stages',
            resource: 'task-stages/menu',
          },
          {
            icon: PrimeIcons.TAG,
            routerLink: ['/settings/tasks/task-types'],
            label: 'Task Types',
            resource: 'task-types/menu',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  // main routing
  mainRoutingManager.addRouting({
    newRouting: TASKS_ROUTES,
    basePath: 'tasks',
  });

  // settings routing
  mainRoutingManager.addRouting({
    newRouting: {
      path: 'tasks',
      children: [
        {
          path: 'task-stages',
          children: TASK_STAGES_ROUTES,
        },
        {
          path: 'task-types',
          children: TASK_TYPES_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });
}
