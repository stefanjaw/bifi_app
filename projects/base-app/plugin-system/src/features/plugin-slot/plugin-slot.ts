import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';

import { PluginManager } from '../../services/plugin-manager';

@Component({
  selector: 'bifi-app-plugin-slot',
  template: '',
})
export class PluginSlot implements OnInit {
  @Input()
  name!: string;

  private vc = inject(ViewContainerRef);
  private pluginManager = inject(PluginManager);

  ngOnInit() {
    const plugins = this.pluginManager.getBySlot(this.name);

    for (const plugin of plugins) {
      this.vc.createComponent(plugin.component);
    }
  }
}
