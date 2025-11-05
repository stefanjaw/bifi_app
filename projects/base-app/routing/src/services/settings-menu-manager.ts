import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BaseMenuManager } from '../libraries/base-menu-manager';
import { SETTINGS_ROUTES } from '../routing/settings.routes';

@Injectable({
  providedIn: 'root',
})
export class SettingsMenuManager extends BaseMenuManager {
  constructor() {
    const menuItems = signal<MenuItem[]>([
      {
        icon: 'pi pi-building',
        routerLink: ['/settings/companies'],
        label: 'Companies',
        resource: 'companies',
      },
      {
        icon: 'pi pi-user',
        routerLink: ['/settings/users'],
        label: 'Users',
        resource: 'users',
      },
      {
        icon: 'pi pi-user',
        routerLink: ['/settings/roles'],
        label: 'Roles',
        resource: 'roles',
      },
      {
        icon: 'pi pi-check',
        routerLink: ['/settings/policies'],
        label: 'Policies',
        resource: 'policies',
      },
      {
        icon: 'pi pi-globe',
        routerLink: ['/settings/countries'],
        label: 'Countries',
        resource: 'countries',
      },
    ]);

    super(menuItems, SETTINGS_ROUTES);
  }
}
