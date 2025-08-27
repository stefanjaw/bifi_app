import { Injectable, signal } from '@angular/core';
import { BaseMenuManager } from '@avalantec/base-app/routing';
import { BASE_APP_ROUTES } from '@avalantec/base-app';
import { MenuItem } from 'primeng/api';

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
