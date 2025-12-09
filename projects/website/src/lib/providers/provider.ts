import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeWebsite } from './initializer/init';

export function provideWebsite(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeWebsite)];
}
