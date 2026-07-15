import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavManager {
  private _opened = signal<boolean>(false);

  opened = this._opened.asReadonly();

  /** Opens the sidenav panel */
  openSidenav() {
    this._opened.set(true);
  }

  /** Closes the sidenav panel */
  closeSidenav() {
    this._opened.set(false);
  }

  /**
   * Programmatically sets the sidenav open/closed state
   * @param value - Whether the sidenav should be open
   */
  setOpenSidenav(value: boolean) {
    this._opened.set(value);
  }
}
