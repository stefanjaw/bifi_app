import { InjectionToken, ExistingProvider, forwardRef, Type } from '@angular/core';

export const PLUGIN_CONTEXT = new InjectionToken<any>('PLUGIN_CONTEXT');

export function providePluginContext(component: Type<any>): ExistingProvider {
  return {
    provide: PLUGIN_CONTEXT,
    useExisting: forwardRef(() => component),
  };
}
