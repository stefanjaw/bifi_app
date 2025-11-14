import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeCalendar } from './initializer/init';

export function provideCalendar(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeCalendar)];
}
