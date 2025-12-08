import { inject } from '@angular/core';
import { WEBSITE_ROUTES } from '../../routes/website-routes';
import { MainRoutingManager } from '@avalantec/base-app/routing';

export function initializeWebsite() {
  initializeMenu();
}

function initializeMenu() {
  const mainRoutingManager = inject(MainRoutingManager);

  mainRoutingManager.addRouting({
    newRouting: WEBSITE_ROUTES,
    basePath: 'website',
  });
}
