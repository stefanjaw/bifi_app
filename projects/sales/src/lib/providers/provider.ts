import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeSales } from './initializer/init';

export function provideSales(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeSales)];
}
