import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeAccounting } from './initializer/init';

export function provideAccounting(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeAccounting)];
}
