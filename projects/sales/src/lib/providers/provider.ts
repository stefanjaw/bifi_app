import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeSales } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/i18n';

/** Registers the Sales module and pre-fetches its translation scope */
export function provideSales(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeSales), provideTranslations('sales')];
}
