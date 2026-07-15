import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation';

@Pipe({
  name: 'localeDate',
  pure: false,
})
export class LocaleDatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(
    value: string | number | Date | null | undefined,
    options?: Intl.DateTimeFormatOptions
  ): string | null {
    if (value == null || value === '') return null;
    const locale = this.translationService.activeLanguage();
    try {
      return new Intl.DateTimeFormat(locale, options).format(new Date(value));
    } catch {
      return String(value);
    }
  }
}
