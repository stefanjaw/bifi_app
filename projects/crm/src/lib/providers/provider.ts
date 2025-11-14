import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeCRM } from './initializer/init';

export function provideCRM(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeCRM)];
}
