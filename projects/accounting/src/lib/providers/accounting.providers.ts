import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeAccounting } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/translation';

/** Registers the Accounting module and pre-fetches its translation scope */
export function provideAccounting(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeAccounting), provideTranslations('accounting')];
}
