import { inject, Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { TranslationService } from '@avalantec/base-app/i18n';
import { FORM_ERROR_TRANSLATIONS } from '../libraries/providers/form-errors';

/**
 * Bridge between the form validation layer and the backend-driven TranslationService.
 * Falls back to the static FORM_ERROR_TRANSLATIONS map when no backend translation is found.
 */
@Injectable({
  providedIn: 'root',
})
export class FormTranslation {
  private translationService = inject(TranslationService);
  private defaultTranslations = inject(FORM_ERROR_TRANSLATIONS);

  /**
   * Returns the localized error message for a form validation errorKey.
   * First tries the backend translation under `${prefix}.${errorKey}`;
   * falls back to the static default map.
   *
   * @param prefix - Dot-notation key prefix (default: 'core.form.validation')
   * @param errorKey - The Angular form validation error name
   * @param params - Optional parameters passed to the message function
   */
  getErrorMessage({
    prefix = 'core.form.validation',
    errorKey,
    params,
  }: {
    prefix?: string;
    errorKey: string;
    params?: ParamMap;
  }): string | null {
    const translation = this.translate(`${prefix}.${errorKey}`, params);

    if (!translation) {
      const message = this.defaultTranslations[errorKey];
      if (typeof message === 'string') {
        return message;
      } else if (typeof message === 'function') {
        return message(params);
      }
    }

    return translation;
  }

  /**
   * Translates a dotted key via TranslationService with the 'core' scope.
   * Returns null if the translation key is returned unchanged (i.e. not found in backend).
   *
   * @param key - The translation key to look up
   * @param params - Optional parameter map for placeholder substitution
   */
  protected translate(key: string, params?: ParamMap): string | null {
    const result = this.translationService.translate(key, params as any, 'core');
    return result === key ? null : result;
  }
}
