import { Component, inject, input, Signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidenavManager } from '../../services/sidenav-manager';
import { Toast } from 'primeng/toast';
import { APP_FRONTEND_AUTH_SERVICE, AuthState } from '@avalantec/base-app/auth';
import { user } from '@avalantec/base-app/settings';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bifi-app-scaffold',
  imports: [
    ToolbarModule,
    RouterOutlet,
    Toast,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    CommonModule,
  ],
  templateUrl: './scaffold.html',
  styleUrl: './scaffold.css',
})
export class Scaffold {
  title = input('');
  brandIcon = input('');

  private router = inject(Router);

  // sidenav managament
  protected sidenavManager = inject(SidenavManager);
  isSidenavAvailable = this.sidenavManager.isSidenavAvailable;
  isOpened = this.sidenavManager.isOpened;

  // auth state management
  private authState = inject(AuthState);
  private authService = inject(APP_FRONTEND_AUTH_SERVICE);
  user: Signal<user | undefined> = this.authState.user;

  goHome() {
    this.router.navigate(['home']);
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['auth', 'signin']);
    });
  }
}
