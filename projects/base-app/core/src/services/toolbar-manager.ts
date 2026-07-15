import { Injectable, signal, WritableSignal } from '@angular/core';

export interface ToolbarItem {
  icon: string;
  tooltip: string;
  command: () => void;
}

export class BaseToolbarManager {
  private _items: WritableSignal<ToolbarItem[]>;

  constructor(items: WritableSignal<ToolbarItem[]>) {
    this._items = items;
  }

  get toolbarItems() {
    return this._items;
  }

  /**
   * Appends a single toolbar action button
   * @param item - The toolbar item to add
   */
  addItem(item: ToolbarItem) {
    this._items.update(items => [...items, item]);
  }

  /**
   * Appends multiple toolbar action buttons at once
   * @param items - The toolbar items to add
   */
  addItems(items: ToolbarItem[]) {
    items.forEach(item => this.addItem(item));
  }
}

@Injectable({ providedIn: 'root' })
export class ToolbarManager extends BaseToolbarManager {
  constructor() {
    super(signal<ToolbarItem[]>([]));
  }
}
