import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeAduanix } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/i18n';

/** Registers the Aduanix module and pre-fetches its translation scope */
export function provideAduanix(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeAduanix), provideTranslations('aduanix')];
}
