import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { injectAuthService } from '@avalantec/base-app/auth';
import { BugReportingFormDialog } from '@avalantec/base-app/bug-reporting';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'bifi-app-user-panel',
  imports: [ButtonModule, AvatarModule, MenuModule, BugReportingFormDialog],
  templateUrl: './user-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPanel {
  private authService = injectAuthService();
  private router = inject(Router);
  private bugDialog = viewChild(BugReportingFormDialog);

  user = this.authService.user;

  items: MenuItem[] = [
    {
      label: this.user()?.email || 'Email not set',
      disabled: true,
      style: { 'font-weight': 'bold', opacity: '0.8' },
    },
    { separator: true },
    {
      label: 'Profile (Preview)',
      icon: 'pi pi-user',
      // command: () => this.onProfile(),
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.router.navigate(['settings']),
    },
    {
      separator: true,
    },
    {
      label: 'Report Bug',
      icon: 'pi pi-exclamation-triangle ',
      command: () => this.bugDialog()?.openDialog(),
    },
    {
      label: 'Log-Out',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authService.logout();
        this.router.navigate(['auth', 'signin']);
      },
    },
  ];
}
