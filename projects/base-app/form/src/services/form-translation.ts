import { DestroyRef, inject, Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { FORM_ERROR_TRANSLATIONS } from '../libraries/providers/form-errors';

@Injectable({
  providedIn: 'root',
})
export class FormTranslation {
  // private translocoService = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private defaultTranslations = inject(FORM_ERROR_TRANSLATIONS);

  private memo = new Map<string, any>();

  // constructor() {
  //   this.translocoService
  //     .selectTranslation('core')
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe(v => {
  //       console.log('form validation loaded', v);
  //     });
  // }

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
      // Fallback: use default error messages
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
   * Translates a given key using the TranslocoService, with optional parameters.
   * Utilizes memoization to cache translations and improve performance.
   *
   * @param key - The translation key to be translated.
   * @param params - An optional object containing parameters to be used in the translation.
   * @returns The translated string corresponding to the key and parameters.
   */

  protected translate(_key: string, _params?: ParamMap) {
    // const memoKey = params ? `${key}${JSON.stringify(params)}` : key;

    // if (!this.memo.has(memoKey)) {
    //   this.memo.set(memoKey, this.translocoService.translate(key, params));
    // }

    // return this.memo.get(memoKey);
    return null;
  }
}
