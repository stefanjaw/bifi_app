import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeTasks } from './initializer/init';

export function provideTasks(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeTasks)];
}
