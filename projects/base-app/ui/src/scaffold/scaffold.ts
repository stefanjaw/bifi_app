import { Component, inject, input } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { SidenavManager } from '@avalantec/base-app/core';
import { LIB_AUTH_SERVICE } from '@avalantec/base-app/auth';
import { NgxSonnerToaster } from 'ngx-sonner';
import { BugReportingFormDialog } from '@avalantec/base-app/bug-reporting';
// import { LIB_AUTH_SERVICE } from '@avalantec/base-app/auth';

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
    NgxSonnerToaster,
    BugReportingFormDialog,
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
  isSidenavAvailable = this.sidenavManager.sidenavAvailable;
  isOpened = this.sidenavManager.opened;

  // auth state management
  protected authService = inject(LIB_AUTH_SERVICE);
  user = this.authService.user;

  goHome() {
    this.router.navigate(['home']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth', 'signin']);
  }
}
