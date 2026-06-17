import { Injectable, input, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BaseMenuManager } from '../libraries/base-menu-manager';

@Injectable({
  providedIn: 'root',
})
export class MainMenuManager extends BaseMenuManager {
  title = signal<string>('Welcome to Asset Roster');
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
            icon: 'pi pi-dollar',
            routerLink: ['/settings/currencies'],
            label: 'Currencies',
            resource: 'currencies/menu',
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
          {
            icon: 'pi pi-sort-numeric-up',
            routerLink: ['/settings/sequences'],
            label: 'Sequences',
            resource: 'sequences/menu',
          },
          {
            icon: 'pi pi-search',
            routerLink: ['/settings/search-destinations'],
            label: 'Search',
            resource: 'search-destinations/menu',
          },
          {
            icon: 'pi pi-microchip',
            routerLink: ['/settings/ai-settings'],
            label: 'AI Configuration',
            resource: 'ai-settings/menu',
          },
          {
            icon: 'pi pi-cloud',
            routerLink: ['/settings/drive-settings'],
            label: 'Google Drive Configuration',
            resource: 'drive-settings/menu',
          },
          {
            icon: 'pi pi-bell',
            routerLink: ['/settings/notification-settings'],
            label: 'Notification Events',
            resource: 'notification-settings/menu',
          },
        ],
      },
      {
        icon: 'pi pi-address-book',
        routerLink: ['/contacts'],
        label: 'Contacts',
        resource: 'contacts/menu',
        showInMainMenu: true,
        moduleKey: 'contacts',
      },
    ]);

    super(menuItems);
  }
}
