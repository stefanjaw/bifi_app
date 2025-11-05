import { WritableSignal } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { MenuItem } from 'primeng/api';

// class to manage logic for menu managers
export class BaseMenuManager {
  private _menuItems: WritableSignal<MenuItem[]>;
  private _routes: Routes;

  constructor(menuItems: WritableSignal<MenuItem[]>, routes: Routes) {
    this._menuItems = menuItems;
    this._routes = routes;
  }

  get menuItems() {
    return this._menuItems;
  }

  /**
   * Adds a new item to the menu. The new item should include a routerLink to define the route path.
   * @param newItem The new item to be added. This should include a routerLink to define the route path.
   * @param routes The routes to be added for the new item. If not provided, the route will be created
   *               using the routerLink of the new item.
   * @param route The route to be added for the new item. If not provided, the routerLink of the new item
   *              will be used to create the route.
   */
  addItem({
    newItem,
    routes = undefined,
    route = undefined,
    childOf = undefined,
  }: {
    /**
     * The new item to be added. This should include a routerLink to define the route path.
     */
    newItem: MenuItem;
    /**
     * The routes to be added for the new item. If not provided, the route will be created
     * using the routerLink of the new item.
     */
    routes?: Routes;
    /**
     * The route to be added for the new item. If not provided, the routerLink of the new item
     * will be used to create the route.
     */
    route?: Route;
    childOf?: string;
  }) {
    // Update the menu items by adding it the new item
    this._menuItems.update(items => {
      if (childOf) {
        // Find the parent item
        // Split the childOf path into segments
        const splittedPath = childOf.split('/');

        // Start from the root routes
        let currentMenu = items;

        // Traverse the routes to find the parent
        for (const pathSegment of splittedPath) {
          const foundItem = items.find(r =>
            (r.routerLink as string[]).some(link => link.includes(pathSegment))
          );

          if (foundItem) {
            if (!foundItem.items) {
              foundItem.items = [];
            }
            currentMenu = foundItem.items;
          } else {
            currentMenu = [];
            break;
          }
        }

        currentMenu.push(newItem);
      } else {
        items.push(newItem);
      }

      return items;
    });

    // Add the routes for the new item to the routes array
    // Ensure that either routes or route is provided
    if (!routes && !route) throw new Error('Either routes or route must be provided');

    // search for correct base array to add child routes
    let parent: Routes | undefined = undefined;

    // If childOf is provided, find the parent route
    if (childOf) {
      // Split the childOf path into segments
      const splittedPath = childOf.split('/');

      // Start from the root routes
      let currentRoutes = this._routes;

      // Traverse the routes to find the parent
      for (const pathSegment of splittedPath) {
        const foundRoute = currentRoutes.find(r => r.path === pathSegment);

        if (foundRoute) {
          if (!foundRoute.children) {
            foundRoute.children = [];
          }
          currentRoutes = foundRoute.children;
        } else {
          currentRoutes = [];
          break;
        }
      }

      parent = currentRoutes;
    } else {
      parent = this._routes;
    }

    // If parent is not found, throw an error
    if (!parent) throw new Error(`Parent route with path ${childOf} not found`);

    if (!route && routes) {
      // Create a new route with the path from the new item
      const newPath = Array.isArray(newItem.routerLink)
        ? newItem.routerLink.join('/')
        : newItem.routerLink;

      // Create a new route with the path from the new item
      parent.push({
        path: newPath.charAt(0) === '/' ? newPath.slice(1) : newPath,
        children: routes,
      });
    } else if (route && !routes) {
      // Use the route provided
      parent.push(route);
    }
  }

  /**
   * Removes an item from the menu
   * @param title The title of the menu item to be removed
   */
  // removeItem(title: string) {
  //   const menuItems = this._menuItems();
  //   const menuIndex = menuItems.findIndex(item => item.title === title);

  //   // If the item is not found, do nothing
  //   if (menuIndex === -1) return;

  //   // Remove the item from the menu
  //   menuItems.splice(menuIndex, 1);

  //   // Update the menu items signal
  //   this._menuItems.set(menuItems);

  //   // Find the index of the route in the routes array
  //   const routerIndex = this._routes.findIndex(route =>
  //     route.path?.includes(menuItems[menuIndex].routerLink)
  //   );

  //   // If the route is not found, do nothing
  //   if (routerIndex === -1) return;

  //   // Remove the route from the routes array
  //   this._routes.splice(routerIndex, 1);
  // }

  /**
   * Adds multiple items to the menu
   * @param newItems An array of objects with a `menuItem` property representing the item to be added
   * and a `routes` property representing the routes to be added for the item
   */
  addItems(newItems: { menuItem: MenuItem; routes?: Routes; route?: Route; childOf?: string }[]) {
    /**
     * For each item in the array, call `addItem` with the item and the routes
     */
    newItems.forEach(item =>
      this.addItem({
        newItem: item.menuItem,
        routes: item.routes,
        route: item.route,
        childOf: item.childOf,
      })
    );
  }

  /**
   * Removes multiple items from the menu
   * @param titles The titles of the menu items to be removed
   */
  // removeItems(titles: string[]) {
  //   titles.forEach(title => this.removeItem(title));
  // }
}
