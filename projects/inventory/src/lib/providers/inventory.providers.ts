import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeInventory } from './initializer/init';

export function provideInventory(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeInventory)];
}
