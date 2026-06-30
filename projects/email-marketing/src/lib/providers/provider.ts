import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeEmailMarketing } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/translation';

/** Registers the Email Marketing module and pre-fetches its translation scope */
export function provideEmailMarketing(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeEmailMarketing), provideTranslations('email-marketing')];
}
