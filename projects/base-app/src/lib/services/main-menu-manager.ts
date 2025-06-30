import { Injectable, signal } from '@angular/core';
import { menuItem } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MainMenuManager {
  menuItems = signal<menuItem[]>([
    {
      iconName: 'settings',
      route: '/settings',
      title: 'Settings',
    },
  ]);

  constructor() {}

  addItem(newItem: menuItem) {
    this.menuItems.update((items) => [...items, newItem]);
  }

  removeItem(title: string) {
    const menuItems = this.menuItems();
    const index = menuItems.findIndex((item) => item.title === title);

    if (index === -1) return;

    menuItems.splice(index, 1);
    this.menuItems.set(menuItems);
  }

  addItems(newItems: menuItem[]) {
    newItems.forEach((item) => this.addItem(item));
  }

  removeItems(titles: string[]) {
    titles.forEach((title) => this.removeItem(title));
  }
}
