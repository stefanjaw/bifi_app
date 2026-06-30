import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeHelpdesk } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/translation';

/** Registers the Helpdesk module and pre-fetches its translation scope */
export function provideHelpdesk(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeHelpdesk), provideTranslations('helpdesk')];
}
