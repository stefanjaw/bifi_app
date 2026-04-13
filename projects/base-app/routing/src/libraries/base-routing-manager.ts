import { Route, Routes } from '@angular/router';

export class BaseRoutingManager {
  private _routes: Routes;

  constructor(routes: Routes) {
    this._routes = routes;
  }

  get routes(): Routes {
    return this._routes;
  }

  /**
   * Adds a new route to the existing routes. If a basePath is provided, the new route will be added as a child of the route with the provided path.
   * If a childOf is provided, the new route will be added as a child of the route with the provided path.
   * @param {object} params - Parameters for the function
   * @param {Routes | Route} params.newRouting - The new route to be added
   * @param {string} params.basePath - The path of the parent route
   * @param {string} params.childOf - The path of the parent route
   */
  addRouting({
    newRouting,
    basePath,
    childOf,
  }: {
    newRouting: Routes | Route;
    basePath?: string;
    childOf?: string;
  }): void {
    // If newRouting is an array, basePath is required
    if (Array.isArray(newRouting) && !basePath)
      throw new Error('Base path is required when adding an array of routes');

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
          // If the route is not found, use previous currentRoutes as parent
          break;
        }
      }

      parent = currentRoutes;
    } else {
      parent = this._routes;
    }

    // If parent is not found, throw an error
    if (!parent) throw new Error(`Parent route with path ${childOf} not found`);

    // search for wildcard route to add new route before it, if it exists
    const wildcardRouteIndex = this._routes.findIndex(r => r.path === '**');

    // If wildcard route exists, remove it
    const wildcardRoute =
      wildcardRouteIndex !== -1 ? this._routes.splice(wildcardRouteIndex, 1)[0] : null;

    // Add new route to the parent
    if (Array.isArray(newRouting) && basePath) {
      // Create a new route with the path from the new item
      parent.push({
        path: basePath.charAt(0) === '/' ? basePath.slice(1) : basePath,
        children: newRouting,
      });
    } else if (!Array.isArray(newRouting) && !basePath) {
      // Use the route provided
      parent.push(newRouting);
    }

    // Add wildcard route back to the end of the routes
    if (wildcardRoute) {
      this._routes.push(wildcardRoute);
    } else {
      // If no wildcard route exists, add a default one that redirects to home
      this._routes.push({ path: '**', pathMatch: 'full', redirectTo: 'home' });
    }
  }
}
