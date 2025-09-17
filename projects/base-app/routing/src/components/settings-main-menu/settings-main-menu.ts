import { Component, effect, inject, model, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidenavManager } from '@avalantec/base-app/core';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { SettingsMenuManager } from '../../services/settings-menu-manager';
import { HasPermission } from '@avalantec/base-app/auth';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'bifi-app-settings-main-menu',
  imports: [RouterOutlet, DrawerModule, MenuModule, RippleModule, HasPermission, RouterLink],
  templateUrl: './settings-main-menu.html',
  styleUrl: './settings-main-menu.css',
})
export class SettingsMainMenu implements OnDestroy {
  private menuManager = inject(SettingsMenuManager);
  public sidenavManager = inject(SidenavManager);

  menuItems = this.menuManager.menuItems;
  isOpened = model(this.sidenavManager.opened());

  constructor() {
    this.sidenavManager.setSidenavAvailable(true);

    effect(() => {
      const isSidenavOpen = this.sidenavManager.opened();
      this.isOpened.set(isSidenavOpen);
    });

    effect(() => {
      const isLocallyOpen = this.isOpened();
      this.sidenavManager.setOpenSidenav(isLocallyOpen);
    });
  }

  ngOnDestroy(): void {
    this.sidenavManager.setSidenavAvailable(false);
  }
}
