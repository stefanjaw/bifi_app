import { signal, WritableSignal } from '@angular/core';

export class ColWidthManager {
  readonly colWidths: WritableSignal<Record<string, number>>;

  private _resizing = false;
  private _startX = 0;
  private _startW = 0;
  private _colKey = '';

  constructor(
    private readonly defaults: Record<string, number>,
    private readonly storageKey: string
  ) {
    let initial = { ...defaults };
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) initial = { ...defaults, ...JSON.parse(saved) };
    } catch {
      /* empty */
    }
    this.colWidths = signal(initial);
  }

  onResizeStart(event: MouseEvent, colKey: string) {
    event.preventDefault();
    this._resizing = true;
    this._startX = event.clientX;
    this._startW = this.colWidths()[colKey];
    this._colKey = colKey;
  }

  onResizeMove(event: MouseEvent) {
    if (!this._resizing) return;
    const delta = event.clientX - this._startX;
    const newWidth = Math.max(60, this._startW + delta);
    this.colWidths.update(w => {
      const next = { ...w, [this._colKey]: newWidth };
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(next));
      } catch {
        /* empty */
      }
      return next;
    });
  }

  onResizeEnd() {
    this._resizing = false;
  }
}
