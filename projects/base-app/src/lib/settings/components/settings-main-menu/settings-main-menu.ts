import { Component, inject, OnDestroy } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { SettingsMenuManager } from '../../services/settings-menu-manager';
import { MatIcon } from '@angular/material/icon';
import { SidenavManager } from '../../../common';

@Component({
  selector: 'bifi-app-settings-main-menu',
  imports: [MatSidenavModule, MatListModule, MatIcon, RouterOutlet],
  templateUrl: './settings-main-menu.html',
  styleUrl: './settings-main-menu.css',
})
export class SettingsMainMenu implements OnDestroy {
  private menuManager = inject(SettingsMenuManager);
  private router = inject(Router);
  private sidenavManager = inject(SidenavManager);

  menuItems;
  isOpened;

  constructor() {
    // * SET ITEMS WHEN STARTING APP AND EACH TIME THESE ARE BEING UPDATED
    this.menuItems = this.menuManager.menuItems;
    this.isOpened = this.sidenavManager.isOpened;
    this.sidenavManager.setIsSidenavAvailable = true;
  }

  ngOnDestroy(): void {
    this.sidenavManager.setIsSidenavAvailable = false;
  }

  goToOption(route: string) {
    this.forceSidenavClose();
    this.router.navigate([route]);
  }

  forceSidenavClose() {
    this.sidenavManager.closeSidenav();
  }
}
