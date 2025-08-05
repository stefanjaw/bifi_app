import { Injectable, signal } from '@angular/core';
import { BaseMenuManager } from '@avalantec/base-app/core';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class SettingsMenuManager extends BaseMenuManager {
  constructor() {
    const menuItems = signal<MenuItem[]>([
      {
        icon: 'pi pi-question',
        routerLink: ['/settings/contacts'],
        label: 'Contacts',
      },
      {
        icon: 'pi pi-fw',
        routerLink: ['/settings/companies'],
        label: 'Companies',
      },
      {
        icon: 'pi pi-fw',
        routerLink: ['/settings/roles'],
        label: 'Roles',
      },
      {
        icon: 'pi pi-fw',
        routerLink: ['/settings/permissions'],
        label: 'Permissions',
      },
    ]);

    super(menuItems);
  }
}
