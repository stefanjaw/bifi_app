import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeWebsite } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/i18n';

/** Registers the Website module and pre-fetches its translation scope */
export function provideWebsite(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeWebsite), provideTranslations('website')];
}
