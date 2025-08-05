import { Injectable, signal } from '@angular/core';
import { BaseMenuManager } from '../libraries/base-menu-manager';
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

    super(menuItems);
  }
}
