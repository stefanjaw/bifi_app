import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializePurchases } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/i18n';

/** Registers the Purchases module and pre-fetches its translation scope */
export function providePurchases(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializePurchases), provideTranslations('purchases')];
}
