import { EnvironmentProviders, provideAppInitializer, Provider } from '@angular/core';
import { initializeCalendar } from './initializer/init';
import { provideTranslations } from '@avalantec/base-app/translation';

/** Registers the Calendar module and pre-fetches its translation scope */
export function provideCalendar(): EnvironmentProviders | Provider {
  return [provideAppInitializer(initializeCalendar), provideTranslations('calendar')];
}
