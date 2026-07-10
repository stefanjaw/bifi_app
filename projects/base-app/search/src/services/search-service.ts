import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import Fuse from 'fuse.js';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { injectAuthService } from '@avalantec/base-app/auth';
import { resource, user } from '@avalantec/base-app/interfaces';
import { TranslationService } from '@avalantec/base-app/i18n';
import { SearchDestination, SearchResultGroup } from '../interfaces/search-destination';

interface IndexedDestination extends SearchDestination {
  _searchLabel: string;
  _searchGroup: string;
  _searchDescription: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  private apiURL = inject(LIBRARY_CONFIG).apiURL;
  private auth = injectAuthService();
  private translationService = inject(TranslationService);

  private _loaded = signal(false);
  private _loading = false;
  private _rawDestinations: SearchDestination[] = [];
  private _fuseCache = new Map<string, Fuse<IndexedDestination>>();

  readonly loaded = this._loaded.asReadonly();

  /**
   * Fetches and indexes all search destinations from the server. Skips if already loaded unless `force` is true.
   * @param force - If true, forces a reload even if destinations are already loaded
   */
  async load(force = false): Promise<void> {
    if (this._loading) return;
    if (this._loaded() && !force) return;

    this._loading = true;
    try {
      const base = this.apiURL.endsWith('/') ? this.apiURL.slice(0, -1) : this.apiURL;
      const url = `${base}/search-destinations/all`;
      const data = await firstValueFrom(this.http.get<SearchDestination[]>(url));
      this._rawDestinations = Array.isArray(data) ? data : [];
      this._fuseCache.clear();
      this._loaded.set(true);
    } catch {
      /* empty */
    } finally {
      this._loading = false;
    }
  }

  /**
   * Performs a fuzzy search against the loaded destinations, filtered by the current user's permissions.
   * Labels and groups are translated to the active language for both search and display.
   * @param query - The search query string
   * @returns An array of grouped search results with translated labels
   */
  search(query: string): SearchResultGroup[] {
    this._loaded();
    const lang = this.translationService.activeLanguage();
    const currentUser = this.auth.user();
    const q = query.trim();

    if (!q || !this._rawDestinations.length) return [];

    const fuse = this._getOrBuildFuse(lang);
    const matched = fuse.search(q).map(result => result.item);
    const visible = matched.filter(destination => this.canSee(destination, currentUser));
    return this.groupResults(visible);
  }

  private _getOrBuildFuse(lang: string): Fuse<IndexedDestination> {
    const cached = this._fuseCache.get(lang);
    if (cached) return cached;

    const indexed = this._rawDestinations.map(d => ({
      ...d,
      _searchLabel: d.scope ? this.translationService.translate(d.label, {}, d.scope) : d.label,
      _searchGroup:
        d.group && d.scope
          ? (() => {
              const t = this.translationService.translate(d.group!, {}, d.scope);
              return t !== d.group
                ? t
                : this.translationService.translate(d.group!, {}, 'base-app/routing');
            })()
          : (d.group ?? ''),
      _searchDescription:
        d.description && d.scope
          ? this.translationService.translate(d.description, {}, d.scope)
          : (d.description ?? ''),
    }));

    const fuse = new Fuse(indexed, {
      includeScore: true,
      ignoreLocation: true,
      threshold: 0.4,
      minMatchCharLength: 1,
      keys: [
        { name: '_searchLabel', weight: 0.5 },
        { name: 'keywords', weight: 0.3 },
        { name: '_searchGroup', weight: 0.15 },
        { name: '_searchDescription', weight: 0.05 },
      ],
    });

    this._fuseCache.set(lang, fuse);
    return fuse;
  }

  private canSee(destination: SearchDestination, currentUser: user | null): boolean {
    const res = destination.resource?.trim();
    if (!res) return true;
    if (!currentUser) return false;

    return this.auth.hasPermission({
      user: currentUser,
      resource: res as resource,
      type: 'menu',
      context: {},
    });
  }

  private translateGroup(groupKey: string, scope: string | undefined): string {
    if (!groupKey || groupKey === 'Other') return groupKey;
    if (!scope) return groupKey;

    const result = this.translationService.translate(groupKey, {}, scope);
    if (result !== groupKey) return result;

    return this.translationService.translate(groupKey, {}, 'base-app/routing');
  }

  private groupResults(items: IndexedDestination[]): SearchResultGroup[] {
    const groups: SearchResultGroup[] = [];
    const index = new Map<string, SearchResultGroup>();

    for (const item of items) {
      const rawGroup = item.group?.trim() || 'Other';
      const translatedGroup = this.translateGroup(rawGroup, item.scope);

      let group = index.get(translatedGroup);
      if (!group) {
        group = { group: translatedGroup, items: [] };
        index.set(translatedGroup, group);
        groups.push(group);
      }
      group.items.push({
        _id: item._id,
        key: item.key,
        label: item._searchLabel,
        route: item.route,
        icon: item.icon,
        group: item._searchGroup,
        keywords: item.keywords,
        description: item._searchDescription,
        resource: item.resource,
        scope: item.scope,
        active: item.active,
        isSystem: item.isSystem,
      });
    }

    return groups;
  }
}
