import { Component, DestroyRef, effect, inject, input, model, signal } from '@angular/core';
import { EventType, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DebugManager, SidenavManager } from '@avalantec/base-app/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { UserPanel } from '../user-panel/user-panel';
import { HasPermission, injectAuthService } from '@avalantec/base-app/auth';
import { RippleModule } from 'primeng/ripple';
import { MainMenuManager } from '@avalantec/base-app/routing';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

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
    ScrollPanelModule,
    PanelMenuModule,
    RippleModule,
    HasPermission,
    RouterLink,
    TooltipModule,
  ],
  templateUrl: './scaffold.html',
  styleUrl: './scaffold.css',
})
export class Scaffold {
  title = input('');
  brandIcon = input('');

  private router = inject(Router);
  private destroy$ = inject(DestroyRef);
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

  // current route
  currentRoute = signal(this.router.url);

  constructor() {
    effect(() => {
      const isSidenavOpen = this.sidenavManager.opened();
      this.isOpened.set(isSidenavOpen);
    });

    effect(() => {
      const isLocallyOpen = this.isOpened();
      this.sidenavManager.setOpenSidenav(isLocallyOpen);
    });

    this.router.events.pipe(takeUntilDestroyed(this.destroy$)).subscribe(event => {
      if (event.type === EventType.NavigationEnd) this.currentRoute.set(this.router.url);
    });
  }

  isItemActive(item: MenuItem) {
    const itemURL = Array.isArray(item.routerLink)
      ? (item.routerLink as string[] | undefined)?.join('/')
      : (item.routerLink as string);

    if (!itemURL) return false;

    return this.currentRoute().startsWith(itemURL);
  }

  hasActiveChild(item: MenuItem): boolean {
    if (!item.items) return false;

    return item.items.some(child => this.isItemActive(child) || this.hasActiveChild(child));
  }

  goHome() {
    this.router.navigate(['home']);
  }
}
