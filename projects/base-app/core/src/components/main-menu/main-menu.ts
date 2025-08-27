import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MainMenuManager } from '@avalantec/base-app';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-app-main-menu',
  imports: [ButtonModule, RouterLink],
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
