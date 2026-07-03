import { APP_INITIALIZER, inject, Provider } from '@angular/core';
import { TranslationService } from '../services/translation';
import { MainMenuManager } from '@avalantec/base-app/routing';
import { PrimeIcons } from 'primeng/api';
import { TRANSLATION_API } from '@avalantec/base-app/form';

/**
 * Root-level providers for the translation system.
 * Register once in app.config.ts providers.
 * Bootstraps language list loading and registers the Settings menu entries
 * for Translations and Languages management pages.
 *
 * @returns Array of Angular providers
 */
const BASE_APP_SCOPES = [
  'base-app/ai-settings',
  'base-app/auth',
  'base-app/branch-office',
  'base-app/bug-reporting',
  'base-app/companies',
  'base-app/contacts',
  'base-app/countries',
  'base-app/currency',
  'base-app/drive-settings',
  'base-app/form',
  'base-app/notification-settings',
  'base-app/policies',
  'base-app/reporting',
  'base-app/resource',
  'base-app/roles',
  'base-app/routing',
  'base-app/search-destinations',
  'base-app/sequences',
  'base-app/templates',
  'base-app/translation',
  'base-app/ui',
  'base-app/users',
];

export function provideTranslationRoot(): Provider[] {
  return [
    TranslationService,
    { provide: TRANSLATION_API, useExisting: TranslationService },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const translationService = inject(TranslationService);
        const menuManager = inject(MainMenuManager);

        return () => {
          translationService.loadLanguages();
          BASE_APP_SCOPES.forEach(scope => translationService.loadScope(scope));

          menuManager.addItems([
            {
              item: {
                icon: PrimeIcons.LANGUAGE,
                label: 'Translations',
                resource: 'translations/settings/menu',
                items: [
                  {
                    icon: PrimeIcons.GLOBE,
                    routerLink: ['/settings/translations'],
                    label: 'Translation Keys',
                    resource: 'translations/list/menu',
                  },
                  {
                    icon: PrimeIcons.FLAG,
                    routerLink: ['/settings/languages'],
                    label: 'Languages',
                    resource: 'languages/list/menu',
                  },
                ],
              },
              childOf: 'settings',
            },
          ]);
        };
      },
      multi: true,
    },
  ];
}

/**
 * Per-library translation scope provider.
 * Add inside each feature lib's provideXxx() to pre-fetch translations for that scope at bootstrap.
 *
 * @param scope - The translation scope identifier (e.g. "sales", "inventory")
 * @returns An Angular APP_INITIALIZER provider
 */
export function provideTranslations(scope: string): Provider {
  return {
    provide: APP_INITIALIZER,
    useFactory: () => {
      const translationService = inject(TranslationService);
      return () => translationService.loadScope(scope);
    },
    multi: true,
  };
}
