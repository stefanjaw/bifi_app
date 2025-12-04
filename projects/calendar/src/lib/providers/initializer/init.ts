import { inject } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { CALENDAR_ROUTES } from '../../routes/calendar.routes';
import { MainMenuManager } from '@avalantec/base-app/routing';

export function initializeCalendar() {
  initializeMenu();
}

function initializeMenu() {
  const mainMenuManager = inject(MainMenuManager);

  mainMenuManager.addItem({
    newItem: {
      icon: PrimeIcons.CALENDAR,
      routerLink: ['/calendar'],
      label: 'Calendar',
      showInMainMenu: true,
      resource: 'calendar/menu',
    },
    routes: CALENDAR_ROUTES,
  });
}
