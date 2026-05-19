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

  register(plugins: FormPlugin[]) {
    this.plugins.push(...plugins);
  }

  getBySlot(slot: string) {
    return this.plugins.filter(p => p.slot === slot);
  }
}
