import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DynamicBreadcrumbService {
  private _labels = signal<Record<string, string>>({});

  labels = computed(() => this._labels());

  set(id: string, label: string): void {
    this._labels.update(map => ({ ...map, [id]: label }));
  }

  clear(id: string): void {
    this._labels.update(map => {
      const next = { ...map };
      delete next[id];
      return next;
    });
  }
}
