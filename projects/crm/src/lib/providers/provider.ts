import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeCrm } from './initializer/init';

export function provideCrm(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeCrm)];
}
