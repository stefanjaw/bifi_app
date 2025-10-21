import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DebugManager {
  private readonly STORAGE_KEY = 'debug';
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);

  private _debugEnabled = signal(false);
  private _cleaningUrl = signal(false);

  constructor() {
    const storedValue = localStorage.getItem(this.STORAGE_KEY);

    if (storedValue) this.setDebugEnable = storedValue === '1';
    else localStorage.setItem(this.STORAGE_KEY, this.debugEnable() ? '1' : '2');

    // check query
    this.router.events
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => this.checkDebugParam());
  }

  get debugEnable() {
    return this._debugEnabled;
  }

  set setDebugEnable(value: boolean) {
    this._debugEnabled.set(value);
    localStorage.setItem(this.STORAGE_KEY, this._debugEnabled() ? '1' : '2');
  }

  toggleDebug() {
    this.setDebugEnable = !this.debugEnable;
  }

  private checkDebugParam() {
    if (this._cleaningUrl()) return;

    const tree = this.router.parseUrl(this.router.url);
    const debugParam = tree.queryParams['debug'];

    if (debugParam) {
      this.setDebugEnable = debugParam === '1';

      // Clean URL
      const { debug, ...rest } = tree.queryParams;
      const urlPath = this.router.url.split('?')[0];
      const cleanTree = this.router.createUrlTree([urlPath], { queryParams: rest });

      this._cleaningUrl.set(true);
      this.router
        .navigateByUrl(cleanTree, { replaceUrl: true })
        .finally(() => this._cleaningUrl.set(false));
    }
  }
}
