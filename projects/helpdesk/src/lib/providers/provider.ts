import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeHelpdesk } from './initializer/init';

export function provideHelpdesk(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeHelpdesk)];
}
