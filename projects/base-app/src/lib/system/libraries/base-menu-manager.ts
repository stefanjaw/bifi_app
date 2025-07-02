import { signal, WritableSignal } from '@angular/core';
import { menuItem } from '../interfaces/menu-item';

// class to manage logic for menu managers
export class BaseMenuManager {
  private _menuItems: WritableSignal<menuItem[]>;

  constructor(menuItems: WritableSignal<menuItem[]>) {
    this._menuItems = menuItems;
  }

  get menuItems() {
    return this._menuItems;
  }

  addItem(newItem: menuItem) {
    this._menuItems.update((items) => [...items, newItem]);
  }

  removeItem(title: string) {
    const menuItems = this._menuItems();
    const index = menuItems.findIndex((item) => item.title === title);

    if (index === -1) return;

    menuItems.splice(index, 1);
    this._menuItems.set(menuItems);
  }

  addItems(newItems: menuItem[]) {
    newItems.forEach((item) => this.addItem(item));
  }

  removeItems(titles: string[]) {
    titles.forEach((title) => this.removeItem(title));
  }
}
