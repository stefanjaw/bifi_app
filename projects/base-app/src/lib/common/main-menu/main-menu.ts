import { Component, effect, inject, signal } from '@angular/core';
import { MainMenuManager } from '../../services/main-menu-manager';
import { menuItem } from '../../interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'bifi-app-main-menu',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.css',
})
export class MainMenu {
  private menuManager = inject(MainMenuManager);
  private router = inject(Router);
  menuItems = signal<menuItem[]>([]);

  constructor() {
    // * SET ITEMS WHEN STARTING APP AND EACH TIME THESE ARE BEING UPDATED
    this.menuItems.set(this.menuManager.menuItems());

    effect(() => {
      this.menuItems.set(this.menuManager.menuItems());
    });
  }

  goToOption(route: string) {
    this.router.navigate([route]);
  }
}
