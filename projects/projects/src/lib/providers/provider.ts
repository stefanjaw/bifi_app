import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeProjects } from './initializer/init';

export function provideProjects(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeProjects)];
}
