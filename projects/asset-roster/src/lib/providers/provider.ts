import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeAssetRoster } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/i18n';

/** Registers the Asset Roster module and pre-fetches its translation scope */
export function provideAssetRoster(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeAssetRoster), provideTranslations('asset-roster')];
}
