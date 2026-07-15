import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeProjects } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/i18n';

/** Registers the Projects module and pre-fetches its translation scope */
export function provideProjects(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeProjects), provideTranslations('projects')];
}
