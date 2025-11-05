import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavManager {
  private _opened = signal<boolean>(false);

  opened = this._opened.asReadonly();

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
