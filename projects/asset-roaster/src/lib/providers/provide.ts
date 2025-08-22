import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeAssetRoster } from './initializer/init';

export function provideAssetRoster(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeAssetRoster)];
}
