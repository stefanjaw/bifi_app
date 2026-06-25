import { Injectable, Type } from '@angular/core';

export interface FormPlugin {
  slot: string;
  component: Type<any>;
}

@Injectable({
  providedIn: 'root',
})
export class PluginManager {
  private plugins: FormPlugin[] = [];

  /**
   * Registers one or more form plugins for dynamic slot injection
   *
   * @param plugins - The plugins to register.
   */
  register(plugins: FormPlugin[]) {
    this.plugins.push(...plugins);
  }

  /**
   * Returns all plugins registered for a given slot name
   *
   * @param slot - The slot name to filter by.
   */
  getBySlot(slot: string) {
    return this.plugins.filter(p => p.slot === slot);
  }
}
