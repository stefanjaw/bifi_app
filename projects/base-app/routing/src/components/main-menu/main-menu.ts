import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MainMenuManager } from '../../services/main-menu-manager';
import { HasPermission } from '@avalantec/base-app/auth';
import { CommonModule } from '@angular/common';
import { Icon } from '@avalantec/base-app/core';

@Component({
  selector: 'bifi-app-main-menu',
  imports: [RouterLink, HasPermission, CommonModule, Icon],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.css',
})
export class MainMenu {
  private menuManager = inject(MainMenuManager);
  private router = inject(Router);
  menuItems;
  mainMenuTitle; 

  constructor() {
    // * SET ITEMS WHEN STARTING APP AND EACH TIME THESE ARE BEING UPDATED
    this.menuItems = this.menuManager.menuItems;
    this.mainMenuTitle = this.menuManager.title
  }

  goToOption(route: string) {
    this.router.navigate([route]);
  }
}
