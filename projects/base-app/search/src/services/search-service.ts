import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import Fuse from 'fuse.js';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { injectAuthService } from '@avalantec/base-app/auth';
import { resource, user } from '@avalantec/base-app/interfaces';
import { SearchDestination, SearchResultGroup } from '../interfaces/search-destination';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  private apiURL = inject(LIBRARY_CONFIG).apiURL;
  private auth = injectAuthService();

  private _loaded = signal(false);
  private _loading = false;
  private fuse: Fuse<SearchDestination> | null = null;

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
      const list = Array.isArray(data) ? data : [];

      this.fuse = new Fuse(list, {
        includeScore: true,
        ignoreLocation: true,
        threshold: 0.4,
        minMatchCharLength: 1,
        keys: [
          { name: 'label', weight: 0.5 },
          { name: 'keywords', weight: 0.3 },
          { name: 'group', weight: 0.15 },
          { name: 'description', weight: 0.05 },
        ],
      });
      this._loaded.set(true);
    } catch {
      /* empty */
    } finally {
      this._loading = false;
    }
  }

  /**
   * Performs a fuzzy search against the loaded destinations, filtered by the current user's permissions
   * @param query - The search query string
   * @returns An array of grouped search results
   */
  search(query: string): SearchResultGroup[] {
    this._loaded();
    const currentUser = this.auth.user();
    const q = query.trim();

    if (!q || !this.fuse) return [];

    const matched = this.fuse.search(q).map(result => result.item);
    const visible = matched.filter(destination => this.canSee(destination, currentUser));
    return this.groupResults(visible);
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

  private groupResults(items: SearchDestination[]): SearchResultGroup[] {
    const groups: SearchResultGroup[] = [];
    const index = new Map<string, SearchResultGroup>();

    for (const item of items) {
      const label = item.group?.trim() || 'Other';
      let group = index.get(label);
      if (!group) {
        group = { group: label, items: [] };
        index.set(label, group);
        groups.push(group);
      }
      group.items.push(item);
    }

    return groups;
  }
}
