import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MainMenuManager } from '../../services/main-menu-manager';

@Component({
  selector: 'bifi-app-main-menu',
  imports: [MatButtonModule, MatIcon],
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
