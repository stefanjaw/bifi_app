import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeInventory } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/i18n';

/** Registers the Inventory module and pre-fetches its translation scope */
export function provideInventory(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeInventory), provideTranslations('inventory')];
}
