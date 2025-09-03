import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavManager {
  private _opened = signal<boolean>(false);
  private _sidenavAvailable = signal<boolean>(false);

  sidenavAvailable = this._sidenavAvailable.asReadonly();
  opened = this._opened.asReadonly();

  setSidenavAvailable(value: boolean) {
    this._sidenavAvailable.set(value);
  }

  openSidenav() {
    this._opened.set(true);
  }

  closeSidenav() {
    this._opened.set(false);
  }

  setOpenSidenav(value: boolean) {
    this._opened.set(value);
  }
}
