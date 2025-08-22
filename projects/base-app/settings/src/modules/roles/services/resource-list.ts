import { computed, Injectable, signal } from '@angular/core';
import { resourceConfig } from '../interfaces/resource-config';

@Injectable({
  providedIn: 'root',
})
export class ResourceList {
  private _resources = signal<resourceConfig[]>([]);

  resources = this._resources.asReadonly();

  // Resource names
  resourceNames = computed(() => this.resources().map(r => r.name));

  // Capitalized resource names
  capitalizedResourceNames = computed(() =>
    this.resourceNames().map(r => r.charAt(0).toUpperCase() + r.slice(1))
  );

  /**
   * Adds one or more resources to the list of resources.
   *
   * @param resources One or more resources to add.
   */
  add(resources: resourceConfig[]) {
    this._resources.update(existing => [...existing, ...resources]);
  }

  /**
   * Removes a resource from the list of resources.
   *
   * @param resource The resource to remove.
   */
  removeResource(resource: resourceConfig) {
    this._resources.update(resources => resources.filter(r => r !== resource));
  }
}
