import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavManager {
  private _isOpened = signal<boolean>(false);
  private _isSidenavAvailable = signal<boolean>(false);

  get isOpened() {
    return this._isOpened;
  }

  get isSidenavAvailable() {
    return this._isSidenavAvailable;
  }

  set setIsSidenavAvailable(value: boolean) {
    this._isSidenavAvailable.set(value);
  }

  openSidenav() {
    this._isOpened.set(true);
  }

  closeSidenav() {
    this._isOpened.set(false);
  }
}
