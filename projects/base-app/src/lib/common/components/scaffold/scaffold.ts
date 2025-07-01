import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { SidenavManager } from '../../services/sidenav-manager';

@Component({
  selector: 'bifi-app-scaffold',
  imports: [MatToolbarModule, RouterOutlet, MatIcon, MatButtonModule],
  templateUrl: './scaffold.html',
  styleUrl: './scaffold.css',
})
export class Scaffold {
  title = input('');
  private router = inject(Router);

  // sidenav managament
  private sidenavManager = inject(SidenavManager);
  isSidenavAvailable;
  isOpened;

  constructor() {
    this.isSidenavAvailable = this.sidenavManager.isSidenavAvailable;
    this.isOpened = this.sidenavManager.isOpened;
  }

  openSidenav() {
    this.sidenavManager.openSidenav();
  }

  closeSidenav() {
    this.sidenavManager.closeSidenav();
  }

  goHome() {
    this.router.navigate(['home']);
  }
}
