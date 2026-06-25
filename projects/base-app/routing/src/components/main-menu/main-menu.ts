import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MainMenuManager } from '../../services/main-menu-manager';
import { NotificationCenterService } from '../../services/notification-center';
import { HasPermission } from '@avalantec/base-app/auth';
import { CommonModule } from '@angular/common';
import { Icon } from '@avalantec/base-app/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'bifi-app-main-menu',
  imports: [RouterLink, HasPermission, CommonModule, Icon],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.css',
})
export class MainMenu {
  private menuManager = inject(MainMenuManager);
  private router = inject(Router);
  protected notificationService = inject(NotificationCenterService);

  menuItems;
  mainMenuTitle;

  constructor() {
    this.menuItems = this.menuManager.menuItems;
    this.mainMenuTitle = this.menuManager.title;
  }

  getChipCount(item: MenuItem): number {
    const link = (
      Array.isArray(item.routerLink)
        ? (item.routerLink as string[]).join('/')
        : ((item.routerLink as string) ?? '')
    ).replace(/^\//, '');
    const segment = link.split('/')[0];
    if (!segment) return 0;
    return this.notificationService.byModule()[segment] ?? 0;
  }

  goToOption(route: string) {
    this.router.navigate([route]);
  }
}
