import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializePurchases } from './initializer/init';

export function providePurchases(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializePurchases)];
}
