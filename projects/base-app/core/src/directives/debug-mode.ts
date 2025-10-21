/* eslint-disable @angular-eslint/directive-selector */
import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { DebugManager } from '../services/debug-manager';

@Directive({
  selector: '[bifiAppDebugMode]',
})
export class DebugMode {
  private tpl = inject(TemplateRef<any>);
  private vc = inject(ViewContainerRef);
  private debugManager = inject(DebugManager);

  constructor() {
    effect(() => {
      const debugEnabled = this.debugManager.debugEnable();
      this.updateView(debugEnabled);
    });
  }

  private updateView(enabled: boolean) {
    this.vc.clear();

    if (enabled) {
      this.vc.createEmbeddedView(this.tpl);
    }
  }
}
