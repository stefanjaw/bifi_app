import { inject } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { CALENDAR_ROUTES } from '../../routes/calendar.routes';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';

export function initializeCalendar() {
  initializeMenu();
}

function initializeMenu() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  mainMenuManager.addItem({
    item: {
      icon: PrimeIcons.CALENDAR,
      routerLink: ['/calendar'],
      label: 'Calendar',
      showInMainMenu: true,
      resource: 'calendar/menu',
    },
  });

  mainRoutingManager.addRouting({
    newRouting: CALENDAR_ROUTES,
    basePath: 'calendar',
  });
}
