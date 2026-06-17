import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import Fuse from 'fuse.js';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { injectAuthService } from '@avalantec/base-app/auth';
import { resource, user } from '@avalantec/base-app/interfaces';
import { SearchDestination, SearchResultGroup } from '../interfaces/search-destination';

/**
 * App-wide command-palette search over navigable destinations.
 *
 * Loads the active destination list once from the backend and caches it, then
 * does all matching in memory with a small fuzzy matcher (Fuse.js). The dataset
 * is small, so this gives instant, typo-tolerant results with zero per-keystroke
 * network calls and zero dependency on any database search engine — fully
 * portable across MongoDB Atlas and self-hosted MongoDB.
 */
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
   * Fetches and caches the active destination list. Idempotent: only hits the
   * network once unless `force` is passed or a previous attempt failed.
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
      // Leave as not-loaded so a later focus/shortcut retries the fetch.
    } finally {
      this._loading = false;
    }
  }

  /**
   * Returns ranked, permission-filtered destinations grouped by area.
   * Reads the destination + user signals so callers can wrap this in a
   * `computed()` and get reactive updates when data loads or the user changes.
   *
   * An empty query returns no results: the palette only navigates to things the
   * user has actually searched for, so pressing Enter on an empty input never
   * routes anywhere.
   */
  search(query: string): SearchResultGroup[] {
    // Read these so a `computed()` wrapping search() re-runs when data finishes
    // loading or the user changes — even on the early-return paths below where
    // the values aren't otherwise used.
    this._loaded();
    const currentUser = this.auth.user();
    const q = query.trim();

    if (!q || !this.fuse) return [];

    const matched = this.fuse.search(q).map(result => result.item);
    const visible = matched.filter(destination => this.canSee(destination, currentUser));
    return this.groupResults(visible);
  }

  /**
   * Permission filter using the same mechanism the sidebar menu uses
   * (`resource` + `:menu`). Destinations without a resource are always visible.
   */
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
