import { Component, inject, input } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SidenavManager } from '@avalantec/base-app/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { UserPanel } from '../user-panel/user-panel';
import { injectAuthService } from '@avalantec/base-app/auth';

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
  ],
  templateUrl: './scaffold.html',
  styleUrl: './scaffold.css',
})
export class Scaffold {
  title = input('');
  brandIcon = input('');

  private router = inject(Router);

  // auth state
  private authService = injectAuthService();
  user = this.authService.user;

  // sidenav managament
  protected sidenavManager = inject(SidenavManager);
  isSidenavAvailable = this.sidenavManager.sidenavAvailable;
  isOpened = this.sidenavManager.opened;

  goHome() {
    this.router.navigate(['home']);
  }
}
