import { WritableSignal } from '@angular/core';
import { MenuItem } from 'primeng/api';

// class to manage logic for menu managers
export class BaseMenuManager {
  private _menuItems: WritableSignal<MenuItem[]>;

  constructor(menuItems: WritableSignal<MenuItem[]>) {
    this._menuItems = menuItems;
  }

  get menuItems() {
    return this._menuItems;
  }

  /**
   * Adds a new item to the menu
   * @param newItem The new item to be added
   */
  addItem(newItem: MenuItem) {
    this._menuItems.update(items => [...items, newItem]);
  }

  /**
   * Removes an item from the menu
   * @param title The title of the menu item to be removed
   */
  removeItem(title: string) {
    const menuItems = this._menuItems();
    const index = menuItems.findIndex(item => item.title === title);

    if (index === -1) return;

    menuItems.splice(index, 1);
    this._menuItems.set(menuItems);
  }

  /**
   * Adds multiple items to the menu
   * @param newItems The items to be added
   */
  addItems(newItems: MenuItem[]) {
    newItems.forEach(item => this.addItem(item));
  }

  /**
   * Removes multiple items from the menu
   * @param titles The titles of the menu items to be removed
   */
  removeItems(titles: string[]) {
    titles.forEach(title => this.removeItem(title));
  }
}
