import { inject, Injectable, signal } from '@angular/core';
import { SidenavManager } from '@avalantec/base-app/core';
import { MenuItem } from 'primeng/api';
import { BaseMenuManager } from '../libraries/base-menu-manager';
import { SETTINGS_ROUTES } from '../routing/settings.routes';

@Injectable({
  providedIn: 'root',
})
export class SettingsMenuManager extends BaseMenuManager {
  private sidenavManager = inject(SidenavManager);

  constructor() {
    const menuItems = signal<MenuItem[]>([
      {
        icon: 'pi pi-users',
        routerLink: ['/settings/contacts'],
        label: 'Contacts',
        resource: 'contacts',
        command: () => this.sidenavManager.closeSidenav(),
      },
      {
        icon: 'pi pi-building',
        routerLink: ['/settings/companies'],
        label: 'Companies',
        resource: 'companies',
        command: () => this.sidenavManager.closeSidenav(),
      },
      {
        icon: 'pi pi-user',
        routerLink: ['/settings/users'],
        label: 'Users',
        resource: 'users',
        command: () => this.sidenavManager.closeSidenav(),
      },
      {
        icon: 'pi pi-user',
        routerLink: ['/settings/roles'],
        label: 'Roles',
        resource: 'roles',
        command: () => this.sidenavManager.closeSidenav(),
      },
      {
        icon: 'pi pi-check',
        routerLink: ['/settings/policies'],
        label: 'Policies',
        resource: 'policies',
        command: () => this.sidenavManager.closeSidenav(),
      },
    ]);

    super(menuItems, SETTINGS_ROUTES[0].children!);
  }
}
