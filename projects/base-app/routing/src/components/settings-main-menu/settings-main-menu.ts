import { Component, effect, inject, model, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavManager } from '@avalantec/base-app/core';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { SettingsMenuManager } from '../../services/settings-menu-manager';

@Component({
  selector: 'bifi-app-settings-main-menu',
  imports: [RouterOutlet, DrawerModule, MenuModule],
  templateUrl: './settings-main-menu.html',
  styleUrl: './settings-main-menu.css',
})
export class SettingsMainMenu implements OnDestroy {
  private menuManager = inject(SettingsMenuManager);
  private sidenavManager = inject(SidenavManager);

  menuItems = this.menuManager.menuItems;
  isOpened = model(this.sidenavManager.opened());

  constructor() {
    this.sidenavManager.setSidenavAvailable(true);

    effect(() => {
      const isServiceOpened = this.sidenavManager.opened();
      const isLocallyOpened = this.isOpened();

      if (isServiceOpened !== isLocallyOpened) {
        this.isOpened.set(isServiceOpened);
        this.sidenavManager.setOpenSidenav(isServiceOpened);
      }
    });
  }

  ngOnDestroy(): void {
    this.sidenavManager.setSidenavAvailable(false);
  }
}
