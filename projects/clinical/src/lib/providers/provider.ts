import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeClinical } from './init';
import { provideTranslations } from '@avalantec/base-app/i18n';

/** Registers the Clinical module and pre-fetches its translation scope */
export function provideClinical(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeClinical), provideTranslations('clinical')];
}
