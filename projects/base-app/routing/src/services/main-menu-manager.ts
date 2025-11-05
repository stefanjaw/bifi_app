import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BaseMenuManager } from '../libraries/base-menu-manager';
import { BASE_APP_ROUTES } from '../routing/base-app.routes';

@Injectable({
  providedIn: 'root',
})
export class MainMenuManager extends BaseMenuManager {
  constructor() {
    const menuItems = signal<MenuItem[]>([
      {
        icon: 'pi pi-home',
        routerLink: ['/home'],
        label: 'Home',
      },
      {
        icon: 'pi pi-cog',
        label: 'Settings',
        routerLink: ['/settings'],
        showInMainMenu: true,
        items: [
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
        ],
      },
      {
        icon: 'pi pi-address-book',
        routerLink: ['/contacts'],
        label: 'Contacts',
        resource: 'contacts',
        showInMainMenu: true,
      },
    ]);

    super(menuItems, BASE_APP_ROUTES);
  }
}
