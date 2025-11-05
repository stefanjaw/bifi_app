import { Component, effect, inject, input, model } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DebugManager, SidenavManager } from '@avalantec/base-app/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { UserPanel } from '../user-panel/user-panel';
import { HasPermission, injectAuthService } from '@avalantec/base-app/auth';
import { DrawerModule } from 'primeng/drawer';
import { RippleModule } from 'primeng/ripple';
import { MainMenuManager } from '@avalantec/base-app/routing';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'bifi-app-scaffold',
  imports: [
    ToolbarModule,
    RouterOutlet,
    Toast,
    MenubarModule,
    ButtonModule,
    CommonModule,
    NgxSonnerToaster,
    UserPanel,
    DrawerModule,
    PanelMenuModule,
    RippleModule,
    HasPermission,
    RouterLink,
  ],
  templateUrl: './scaffold.html',
  styleUrl: './scaffold.css',
})
export class Scaffold {
  title = input('');
  brandIcon = input('');

  private router = inject(Router);
  debugManager = inject(DebugManager);

  // auth state
  private authService = injectAuthService();
  user = this.authService.user;

  // sidenav managament
  protected sidenavManager = inject(SidenavManager);
  isOpened = model(this.sidenavManager.opened());

  // menu managament
  private menuManager = inject(MainMenuManager);
  menuItems = this.menuManager.menuItems;

  constructor() {
    effect(() => {
      const isSidenavOpen = this.sidenavManager.opened();
      this.isOpened.set(isSidenavOpen);
    });

    effect(() => {
      const isLocallyOpen = this.isOpened();
      this.sidenavManager.setOpenSidenav(isLocallyOpen);
    });
  }

  goHome() {
    this.router.navigate(['home']);
  }
}
