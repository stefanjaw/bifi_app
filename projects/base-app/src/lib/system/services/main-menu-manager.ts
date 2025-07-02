import { Injectable, signal } from '@angular/core';
import { menuItem } from '../interfaces/menu-item';
import { BaseMenuManager } from '../libraries/base-menu-manager';

@Injectable({
  providedIn: 'root',
})
export class MainMenuManager extends BaseMenuManager {
  constructor() {
    const menuItems = signal([
      {
        iconName: 'settings',
        route: '/settings',
        title: 'Settings',
      },
    ]);

    super(menuItems);
  }
}
