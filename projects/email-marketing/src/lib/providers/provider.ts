import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeEmailMarketing } from './initializer/init';

export function provideEmailMarketing(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeEmailMarketing)];
}
