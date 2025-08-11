/* eslint-disable @angular-eslint/directive-selector */
import {
  ComponentRef,
  Directive,
  inject,
  input,
  OnChanges,
  OnInit,
  OutputRef,
  ViewContainerRef,
} from '@angular/core';
import { DynamicComponent } from '../interfaces/dynamic-component';

@Directive({
  selector: '[bifiAppDynamicComponent]',
})
export class DynamicComponentDirective implements OnInit, OnChanges {
  component = input.required<DynamicComponent>({
    alias: 'bifiAppDynamicComponent',
  });

  _vcr = inject(ViewContainerRef);

  ngOnInit(): void {
    this.update();
  }

  ngOnChanges(): void {
    this.update();
  }

  private update() {
    if (this._vcr) {
      this.createComponent(this._vcr, this.component());
    }
  }

  private createComponent<T extends Record<string, unknown>>(
    vcr: ViewContainerRef,
    componentData: DynamicComponent<T>
  ): ComponentRef<T> {
    // Clear existing content
    vcr.clear();

    // Create the component
    const componentRef = vcr.createComponent(componentData.component);

    // Set inputs
    if (componentData.inputs) {
      Object.entries(componentData.inputs).forEach(([key, value]) => {
        componentRef.setInput(key, value);
      });
    }

    // Set outputs
    if (componentData.outputs) {
      Object.entries(componentData.outputs).forEach(([key, handler]) => {
        if (typeof handler === 'function') {
          const instance = componentRef.instance as any;
          const output: OutputRef<any> = instance[key];
          output.subscribe(handler as (value: any) => void);
        }
      });
    }

    return componentRef;
  }
}
