import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BaseMenuManager } from '../libraries/base-menu-manager';

@Injectable({
  providedIn: 'root',
})
export class MainMenuManager extends BaseMenuManager {
  title = signal<string>('welcomeTitle');
  constructor() {
    const menuItems = signal<MenuItem[]>([
      {
        icon: 'pi pi-home',
        routerLink: ['/home'],
        label: 'home',
        scope: 'base-app/routing',
      },
      {
        icon: 'pi pi-cog',
        label: 'settings',
        scope: 'base-app/routing',
        routerLink: ['/settings'],
        showInMainMenu: true,
        resource: 'settings/menu',
        items: [
          {
            icon: 'pi pi-building',
            routerLink: ['/settings/companies'],
            label: 'companies',
            scope: 'base-app/companies',
            resource: 'companies/menu',
          },
          {
            icon: 'pi pi-user',
            routerLink: ['/settings/users'],
            label: 'users',
            scope: 'base-app/users',
            resource: 'users/menu',
          },
          {
            icon: 'pi pi-user',
            routerLink: ['/settings/roles'],
            label: 'roles',
            scope: 'base-app/roles',
            resource: 'roles/menu',
          },
          {
            icon: 'pi pi-check',
            routerLink: ['/settings/policies'],
            label: 'policies',
            scope: 'base-app/policies',
            resource: 'policies/menu',
          },
          {
            icon: 'pi pi-globe',
            routerLink: ['/settings/countries'],
            label: 'countries',
            scope: 'base-app/countries',
            resource: 'countries/menu',
          },
          {
            icon: 'pi pi-dollar',
            routerLink: ['/settings/currencies'],
            label: 'currencies',
            scope: 'base-app/currencies',
            resource: 'currencies/menu',
          },
          {
            icon: 'pi pi-file-pdf',
            routerLink: ['/settings/reporting'],
            label: 'reporting',
            scope: 'base-app/reporting',
            resource: 'reporting/menu',
          },
          {
            icon: 'pi pi-file-pdf',
            routerLink: ['/settings/templates'],
            label: 'templates',
            scope: 'base-app/templates',
            resource: 'templates/menu',
          },
          {
            icon: 'pi pi-sort-numeric-up',
            routerLink: ['/settings/sequences'],
            label: 'sequences',
            scope: 'base-app/sequences',
            resource: 'sequences/menu',
          },
          {
            icon: 'pi pi-search',
            routerLink: ['/settings/search-destinations'],
            label: 'search',
            scope: 'base-app/search-destinations',
            resource: 'search-destinations/menu',
          },
          {
            icon: 'pi pi-microchip',
            routerLink: ['/settings/ai-settings'],
            label: 'aiConfiguration',
            scope: 'base-app/ai-settings',
            resource: 'ai-settings/menu',
          },
          {
            icon: 'pi pi-cloud',
            routerLink: ['/settings/drive-settings'],
            label: 'googleDriveConfiguration',
            scope: 'base-app/drive-settings',
            resource: 'drive-settings/menu',
          },
          {
            icon: 'pi pi-bell',
            routerLink: ['/settings/notification-settings'],
            label: 'notificationEvents',
            scope: 'base-app/notification-settings',
            resource: 'notification-settings/menu',
          },
          {
            icon: 'pi pi-language',
            routerLink: ['/settings/translations'],
            label: 'translationKeys',
            scope: 'base-app/translation',
            resource: 'translations/list/menu',
          },
          {
            icon: 'pi pi-flag',
            routerLink: ['/settings/languages'],
            label: 'languages',
            scope: 'base-app/translation',
            resource: 'languages/list/menu',
          },
        ],
      },
      {
        icon: 'pi pi-address-book',
        routerLink: ['/contacts'],
        label: 'contacts',
        scope: 'base-app/contacts',
        resource: 'contacts/menu',
        showInMainMenu: true,
        moduleKey: 'contacts',
      },
    ]);

    super(menuItems);
  }
}
