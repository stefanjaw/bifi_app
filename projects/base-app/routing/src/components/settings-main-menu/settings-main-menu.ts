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
  isOpened = model(this.sidenavManager.isOpened());

  constructor() {
    this.sidenavManager.setIsSidenavAvailable = true;

    effect(() => {
      const isOpened = this.sidenavManager.isOpened();
      this.isOpened.set(isOpened);
    });

    effect(() => {
      const isOpenedModel = this.isOpened();
      if (!isOpenedModel) this.sidenavManager.closeSidenav();
    });
  }

  ngOnDestroy(): void {
    this.sidenavManager.setIsSidenavAvailable = false;
  }
}
