import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeTasks } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/translation';

/** Registers the Tasks module and pre-fetches its translation scope */
export function provideTasks(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeTasks), provideTranslations('tasks')];
}
