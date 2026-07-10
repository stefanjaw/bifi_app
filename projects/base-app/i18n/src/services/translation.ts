import { inject, Injectable, signal, Provider, APP_INITIALIZER } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { languageRecord } from '../interfaces/language';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';

let _ts: TranslationService | null = null;

/**
 * Wires the TranslationService into the global `t()` function.
 * Called once at bootstrap via `provideT()`.
 */
export function setT(ts: TranslationService): void {
  _ts = ts;
}

/**
 * Global translate utility — the TypeScript equivalent of `| translate`.
 * No DI required. Falls back to the raw key if not bootstrapped yet.
 *
 * @param key - The translation key
 * @param params - Optional `{{param}}` substitution map
 * @param scope - Translation scope (e.g. `'asset-roster'`, `'base-app/users'`)
 * @returns The translated string, or the raw key as fallback
 */
export function t(key: string, params?: Record<string, any>, scope?: string): string {
  return _ts?.translate(key, params, scope) ?? key;
}

/**
 * Provider that injects TranslationService into the global `t()` function.
 * Added inside `provideTranslationRoot()` so all apps get it automatically.
 */
export function provideT(): Provider {
  return {
    provide: APP_INITIALIZER,
    useFactory: () => {
      setT(inject(TranslationService));
      return () => {};
    },
    multi: true,
  };
}

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
   * Changes the active locale by pre-loading all cached scopes for the new locale
   * before switching. Prevents a flash of raw untranslated keys.
   * @param locale - The locale code to activate (e.g. "es")
   */
  setLanguage(locale: string): void {
    if (locale === this.activeLanguage()) return;

    const previousScopes = this.getCachedScopes(this.activeLanguage());
    if (previousScopes.length === 0) {
      this.activeLanguage.set(locale);
      return;
    }
    const requests = previousScopes
      .map(scope => this.loadScope(scope, locale))
      .filter((r): r is Observable<Record<string, string>> => !!r);

    if (requests.length === 0) {
      this.activeLanguage.set(locale);
      return;
    }

    forkJoin(requests).subscribe({
      complete: () => this.activeLanguage.set(locale),
    });
  }

  /**
   * Lazily fetches translations for a given scope and locale (defaults to active locale).
   * No-ops if the scope is already cached or currently loading.
   * Returns the Observable for callers that need to wait for completion (e.g. setLanguage).
   * @param scope - The translation scope identifier (e.g. "sales", "base-app/contacts")
   * @param locale - Optional locale override; defaults to activeLanguage()
   * @returns The HTTP Observable, or void if already cached/loading
   */
  loadScope(scope: string, locale?: string): Observable<Record<string, string>> | void {
    const targetLocale = locale ?? this.activeLanguage();
    const cacheKey = `${targetLocale}/${scope}`;
    if (this.cache.has(cacheKey) || this.loadingScopes.has(cacheKey)) return;
    this.loadingScopes.add(cacheKey);
    const request$ = this.http
      .get<Record<string, string>>(`${this.config.apiURL}/translations/scope`, {
        params: { locale: targetLocale, scope },
      })
      .pipe(
        tap({
          next: data => {
            this.cache.set(cacheKey, data);
            this.loadingScopes.delete(cacheKey);
          },
        }),
        catchError(() => {
          this.loadingScopes.delete(cacheKey);
          return of({});
        })
      );
    return request$;
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
