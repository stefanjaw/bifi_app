import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MainMenuManager } from '../../services/main-menu-manager';
import { HasPermission } from '@avalantec/base-app/auth';

@Component({
  selector: 'bifi-app-main-menu',
  imports: [ButtonModule, RouterLink, HasPermission],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.css',
})
export class MainMenu {
  private menuManager = inject(MainMenuManager);
  private router = inject(Router);
  menuItems;

  constructor() {
    // * SET ITEMS WHEN STARTING APP AND EACH TIME THESE ARE BEING UPDATED
    this.menuItems = this.menuManager.menuItems;
  }

  goToOption(route: string) {
    this.router.navigate([route]);
  }
}
