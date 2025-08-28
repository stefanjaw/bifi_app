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
        icon: 'pi pi-cog',
        routerLink: ['/settings'],
        label: 'Settings',
      },
    ]);

    super(menuItems, BASE_APP_ROUTES);
  }
}
