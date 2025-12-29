import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeAduanix } from './initializer/init';

export function provideAduanix(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeAduanix)];
}
