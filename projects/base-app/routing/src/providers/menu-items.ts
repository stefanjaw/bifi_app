import { inject, makeEnvironmentProviders } from '@angular/core';
import { MENU_ITEMS } from '@avalantec/base-app/core';
import { MainMenuManager } from '../services/main-menu-manager';

/** Provides the main menu items as an environment provider for the app shell */
export function provideMenuItems() {
  return makeEnvironmentProviders([
    {
      provide: MENU_ITEMS,
      useFactory: () => {
        const manager = inject(MainMenuManager);
        return manager.menuItems;
      },
    },
  ]);
}
