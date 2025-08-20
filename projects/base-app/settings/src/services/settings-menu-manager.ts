import { inject, Injectable, signal } from '@angular/core';
import { BaseMenuManager, SidenavManager } from '@avalantec/base-app/core';
import { MenuItem } from 'primeng/api';

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
        command: () => this.sidenavManager.closeSidenav(),
      },
      {
        icon: 'pi pi-building',
        routerLink: ['/settings/companies'],
        label: 'Companies',
        command: () => this.sidenavManager.closeSidenav(),
      },
      {
        icon: 'pi pi-user',
        routerLink: ['/settings/users'],
        label: 'Users',
        command: () => this.sidenavManager.closeSidenav(),
      },
      {
        icon: 'pi pi-user',
        routerLink: ['/settings/roles'],
        label: 'Roles',
        command: () => this.sidenavManager.closeSidenav(),
      },
      {
        icon: 'pi pi-check',
        routerLink: ['/settings/policies'],
        label: 'Policies',
        command: () => this.sidenavManager.closeSidenav(),
      },
    ]);

    super(menuItems);
  }
}
