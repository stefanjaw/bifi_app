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
   * Adds a new item to the menu. The new item should include a routerLink to define the route path.
   * @param newItem The new item to be added. This should include a routerLink to define the route path.
   * @param childOf The parent item to add the new item under. If not provided, the new item will be added
   *              as a top level item.
   */
  addItem({ item, childOf }: { item: MenuItem; childOf?: string }) {
    /**
     * Updates the menu items by adding the new item.
     * If childOf is provided, the new item will be added under the parent item with the matching resource or
     * routerLink.
     * If childOf is not provided, the new item will be added as a top level item.
     */
    this._menuItems.update(items => {
      if (childOf) {
        // Find the parent item
        // Split the childOf path into segments
        const splittedPath = childOf.split('/');

        // Start from the root routes
        let currentMenu = items;

        // Traverse the routes to find the parent
        for (const pathSegment of splittedPath) {
          const foundItem = currentMenu.find(r =>
            (r.routerLink as string[])?.some(
              link => link.includes(pathSegment) || r['resource'] === pathSegment
            )
          );

          if (foundItem) {
            if (!foundItem.items) {
              foundItem.items = [];
            }
            currentMenu = foundItem.items;
          } else {
            // If the route is not found, use previous currentMenu as parent
            break;
          }
        }

        currentMenu.push(item);
      } else {
        items.push(item);
      }

      return items;
    });
  }

  /**
   * Adds multiple items to the menu
   * @param newItems An array of objects with a `menuItem` property representing the item to be added
   * and a `routes` property representing the routes to be added for the item
   * @param item.menuItem The item to be added
   * @param item.childOf The parent item to add the item under, if not provided, the new item will be added as a top level item
   */
  addItems(newItems: { item: MenuItem; childOf?: string }[]) {
    /**
     * Loops through the array of items to be added and calls `addItem` for each item
     * @param item The item to be added
     */
    newItems.forEach(item => {
      // Add the item to the menu
      this.addItem({
        item: item.item,
        childOf: item.childOf,
      });
    });
  }
}
