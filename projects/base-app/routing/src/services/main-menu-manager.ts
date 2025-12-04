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
        resource: 'settings/menu',
        items: [
          {
            icon: 'pi pi-building',
            routerLink: ['/settings/companies'],
            label: 'Companies',
            resource: 'companies/menu',
          },
          {
            icon: 'pi pi-user',
            routerLink: ['/settings/users'],
            label: 'Users',
            resource: 'users/menu',
          },
          {
            icon: 'pi pi-user',
            routerLink: ['/settings/roles'],
            label: 'Roles',
            resource: 'roles/menu',
          },
          {
            icon: 'pi pi-check',
            routerLink: ['/settings/policies'],
            label: 'Policies',
            resource: 'policies/menu',
          },
          {
            icon: 'pi pi-globe',
            routerLink: ['/settings/countries'],
            label: 'Countries',
            resource: 'countries/menu',
          },
          {
            icon: 'pi pi-file-pdf',
            routerLink: ['/settings/reporting'],
            label: 'Reporting',
            resource: 'reporting/menu',
          },
          {
            icon: 'pi pi-file-pdf',
            routerLink: ['/settings/templates'],
            label: 'Templates',
            resource: 'templates/menu',
          },
        ],
      },
      {
        icon: 'pi pi-address-book',
        routerLink: ['/contacts'],
        label: 'Contacts',
        resource: 'contacts/menu',
        showInMainMenu: true,
      },
    ]);

    super(menuItems, BASE_APP_ROUTES);
  }
}
