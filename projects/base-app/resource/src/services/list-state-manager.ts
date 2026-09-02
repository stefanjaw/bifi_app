import { Injectable, signal } from '@angular/core';

export interface SerializableFilterRow {
  field: string | null;
  operator: string | null;
  value: any;
  type: string | null;
}

export interface ListState {
  searchText: string;
  filterRows: SerializableFilterRow[];
  page: number;
  limit: number;
  sort: { field: string; order: 'asc' | 'desc' }[];
  view?: string;
}

export const LIST_STATE_QUERY_KEYS = {
  page: '_page',
  limit: '_limit',
  search: '_search',
  filters: '_filters',
  sort: '_sort',
  view: '_view',
} as const;

@Injectable({
  providedIn: 'root',
})
export class ListStateManager {
  /**
   * State pending restoration, set by ResourceManager on init.
   * Read once by FilterBar/SearchBar in their constructors.
   */
  pendingRestore: ListState | null = null;

  /**
   * Partial state accumulated from FilterBar/SearchBar in real time.
   * As a signal, ResourceManager's URL-sync effect reacts to changes.
   */
  partialSave = signal<Partial<ListState>>({});

  /**
   * Stores a list state to be restored later on component init
   *
   * @param state - The list state to restore later.
   */
  setPendingRestore(state: ListState): void {
    this.pendingRestore = state;
  }

  /** Clears any pending list state restoration */
  clearPendingRestore(): void {
    this.pendingRestore = null;
  }

  /**
   * Merges partial state into the accumulated save buffer.
   * Called by FilterBar/SearchBar whenever their state changes.
   *
   * @param partial - The partial state to merge.
   */
  savePartialState(partial: Partial<ListState>): void {
    this.partialSave.update(current => ({ ...current, ...partial }));
  }

  /** Resets the accumulated partial save buffer to empty */
  clearPartialSave(): void {
    this.partialSave.set({});
  }

  /**
   * Persists a full list state snapshot to localStorage under the given key
   *
   * @param key - The localStorage key.
   * @param state - The list state to persist.
   */
  saveToLocalStorage(key: string, state: ListState): void {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore quota exceeded, private browsing, etc.
    }
  }

  /**
   * Restores a previously saved list state from localStorage, or null if none exists
   *
   * @param key - The localStorage key.
   * @returns The restored list state or null.
   */
  loadFromLocalStorage(key: string): ListState | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as ListState) : null;
    } catch {
      return null;
    }
  }

  /**
   * Serialises a partial ListState into Angular Router queryParams.
   * Null values instruct the router to remove the corresponding param.
   *
   * @param state - The partial list state to serialize.
   * @returns A record of query params.
   */
  buildQueryParams(state: Partial<ListState>): Record<string, string | null> {
    const k = LIST_STATE_QUERY_KEYS;
    return {
      [k.page]: state.page != null ? String(state.page) : null,
      [k.limit]: state.limit != null ? String(state.limit) : null,
      [k.search]: state.searchText || null,
      [k.filters]: state.filterRows?.length ? JSON.stringify(state.filterRows) : null,
      [k.sort]: state.sort?.length ? JSON.stringify(state.sort) : null,
      [k.view]: state.view || null,
    };
  }

  /**
   * Parses Angular route queryParams into a ListState.
   * Returns null if none of the recognised keys are present.
   *
   * @param params - The route query parameters.
   * @returns The parsed list state or null.
   */
  parseQueryParams(params: Record<string, string>): ListState | null {
    const k = LIST_STATE_QUERY_KEYS;
    const hasAny =
      k.page in params ||
      k.limit in params ||
      k.search in params ||
      k.filters in params ||
      k.sort in params ||
      k.view in params;

    if (!hasAny) return null;

    const page = params[k.page] ? parseInt(params[k.page], 10) : 1;
    const limit = params[k.limit] ? parseInt(params[k.limit], 10) : 10;
    const searchText = params[k.search] ?? '';
    const view = params[k.view] ?? undefined;

    let filterRows: SerializableFilterRow[] = [];
    try {
      if (params[k.filters]) filterRows = JSON.parse(params[k.filters]);
    } catch {
      filterRows = [];
    }

    let sort: ListState['sort'] = [];
    try {
      if (params[k.sort]) sort = JSON.parse(params[k.sort]);
    } catch {
      sort = [];
    }

    return { page, limit, searchText, filterRows, sort, view };
  }
}
