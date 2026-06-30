import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { languageRecord } from '../interfaces/language';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';

/**
 * Signal-based translation service for the backend-driven i18n system.
 * Fetches translations lazily per scope and caches them per locale+scope key.
 * Falls back to the raw key string when no translation is found.
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private http = inject(HttpClient);
  private config = inject(LIBRARY_CONFIG);

  /** Currently active locale code (e.g. "en", "es") */
  readonly activeLanguage = signal<string>('en');

  /** List of available languages fetched from /api/languages */
  readonly availableLanguages = signal<languageRecord[]>([]);

  private cache = new Map<string, Record<string, string>>();
  private loadingScopes = new Set<string>();

  /**
   * Fetches all active languages from GET /api/languages and populates the
   * availableLanguages signal. Should be called once at application bootstrap.
   */
  loadLanguages(): void {
    this.http
      .get<languageRecord[]>(`${this.config.apiURL}/languages`, {
        params: { active: 'true', limit: '200' },
      })
      .subscribe(res => {
        this.availableLanguages.set(res ?? []);
      });
  }

  /**
   * Changes the active locale, clears the translation cache, and reloads
   * all previously-loaded scopes for the new locale.
   * @param locale - The locale code to activate (e.g. "es")
   */
  setLanguage(locale: string): void {
    const previousScopes = this.getCachedScopes(this.activeLanguage());
    this.cache.clear();
    this.loadingScopes.clear();
    this.activeLanguage.set(locale);
    for (const scope of previousScopes) {
      this.loadScope(scope);
    }
  }

  /**
   * Lazily fetches translations for a given scope and the active locale.
   * No-ops if the scope is already cached or currently loading.
   * @param scope - The translation scope identifier (e.g. "sales", "core")
   */
  loadScope(scope: string): void {
    const locale = this.activeLanguage();
    const cacheKey = `${locale}/${scope}`;
    if (this.cache.has(cacheKey) || this.loadingScopes.has(cacheKey)) return;
    this.loadingScopes.add(cacheKey);
    this.http
      .get<Record<string, string>>(`${this.config.apiURL}/translations/scope`, {
        params: { locale, scope },
      })
      .subscribe({
        next: data => {
          this.cache.set(cacheKey, data);
          this.loadingScopes.delete(cacheKey);
        },
        error: () => {
          this.loadingScopes.delete(cacheKey);
        },
      });
  }

  /**
   * Looks up a translation key in the cache for the active locale and scope.
   * Replaces {{param}} placeholders with values from the params map.
   * Falls back to returning the raw key if no translation is found.
   *
   * @param key - The dot-notation translation key
   * @param params - Optional parameter map for placeholder substitution
   * @param scope - The scope to look up; defaults to '__global'
   * @returns The translated string, or the raw key as fallback
   */
  translate(key: string, params?: Record<string, any>, scope?: string): string {
    const locale = this.activeLanguage();
    const cacheKey = `${locale}/${scope ?? '__global'}`;
    const translations = this.cache.get(cacheKey);
    if (!translations) return key;
    let value = translations[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), String(v));
      }
    }
    return value;
  }

  /** Returns the set of scope identifiers cached for a given locale */
  private getCachedScopes(locale: string): string[] {
    const prefix = `${locale}/`;
    const scopes: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        scopes.push(key.slice(prefix.length));
      }
    }
    return scopes;
  }
}
