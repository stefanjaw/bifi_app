import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeL10nCrEinvoice } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/translation';

/** Registers the CR E-Invoice module and pre-fetches its translation scope */
export function provideL10nCrEinvoice(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeL10nCrEinvoice), provideTranslations('l10n_cr_einvoice')];
}
