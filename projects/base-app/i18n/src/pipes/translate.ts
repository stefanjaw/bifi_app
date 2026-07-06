import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation';

/**
 * Angular pipe for translating keys using the backend-driven TranslationService.
 * Impure so it reacts to language switches automatically.
 *
 * @example
 * {{ 'some.key' | translate }}
 * {{ 'some.key' | translate : { count: 3 } : 'sales' }}
 */
@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  /**
   * Transforms a translation key into its localized string value.
   * @param key - The translation key to look up
   * @param params - Optional parameter map for placeholder substitution
   * @param scope - Optional scope identifier; falls back to '__global'
   * @returns The translated string, or the raw key if not found
   */
  transform(key: string, params?: Record<string, any>, scope?: string): string {
    return this.translationService.translate(key, params, scope);
  }
}
