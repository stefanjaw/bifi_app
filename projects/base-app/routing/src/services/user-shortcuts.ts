import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';

export interface ShortcutItem {
  label?: string;
  icon?: string;
  routerLink?: string[];
  resource?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserShortcutsService {
  private http = inject(HttpClient);
  private apiURL = inject(LIBRARY_CONFIG).apiURL;

  shortcuts = signal<ShortcutItem[]>([]);

  loadShortcuts(): void {
    this.http.get<{ shortcuts: ShortcutItem[] }>(`${this.apiURL}/user-shortcuts/me`).subscribe({
      next: res => this.shortcuts.set(res?.shortcuts ?? []),
      error: () => this.shortcuts.set([]),
    });
  }

  addShortcut(item: ShortcutItem): void {
    const current = this.shortcuts();
    const key = Array.isArray(item.routerLink) ? item.routerLink.join('/') : item.routerLink;
    const alreadyExists = current.some(s => {
      const sKey = Array.isArray(s.routerLink) ? s.routerLink.join('/') : s.routerLink;
      return sKey === key;
    });
    if (alreadyExists) return;
    const updated = [...current, item];
    this.shortcuts.set(updated);
    this.persist(updated);
  }

  removeShortcut(index: number): void {
    const updated = this.shortcuts().filter((_, i) => i !== index);
    this.shortcuts.set(updated);
    this.persist(updated);
  }

  removeShortcutByItem(item: ShortcutItem): void {
    const key = (item.routerLink ?? []).join('/');
    const index = this.shortcuts().findIndex(s => (s.routerLink ?? []).join('/') === key);
    if (index !== -1) this.removeShortcut(index);
  }

  moveShortcut(fromIndex: number, toIndex: number): void {
    const items = [...this.shortcuts()];
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    const [moved] = items.splice(fromIndex, 1);
    const insertAt = toIndex > fromIndex ? toIndex - 1 : toIndex;
    items.splice(insertAt, 0, moved);
    this.shortcuts.set(items);
    this.persist(items);
  }

  private persist(shortcuts: ShortcutItem[]): void {
    this.http.put(`${this.apiURL}/user-shortcuts/me`, { shortcuts }).subscribe();
  }
}
