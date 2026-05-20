import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeL10nCrEinvoice } from './initializer/init';

export function provideL10nCrEinvoice(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeL10nCrEinvoice)];
}
