import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { injectAuthService } from '@avalantec/base-app/auth';
import { FileResolver } from '@avalantec/base-app/resource';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'bifi-app-user-panel',
  imports: [ButtonModule, AvatarModule, MenuModule],
  templateUrl: './user-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPanel {
  private authService = injectAuthService();
  private router = inject(Router);
  private fileResolver = inject(FileResolver);

  user = this.authService.user;
  pictureUrl = signal<string | undefined>(undefined);

  items: MenuItem[] = [
    {
      label: this.user()?.email || 'Email not set',
      disabled: true,
      style: { 'font-weight': 'bold', opacity: '0.8' },
    },
    { separator: true },
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.router.navigate(['settings', 'profile']),
    },
    // {
    //   label: 'Settings',
    //   icon: 'pi pi-cog',
    //   command: () => this.router.navigate(['settings']),
    // },
    {
      separator: true,
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

  constructor() {
    effect(async () => {
      const user = this.user();

      if (user?.uploadedPictureId) {
        const resolvedFile = await this.fileResolver.resolveFile(
          {
            id: user.uploadedPictureId,
          },
          'icon'
        );

        if (resolvedFile) this.pictureUrl.set(URL.createObjectURL(resolvedFile));
        else this.pictureUrl.set(user?.picture);
      } else {
        this.pictureUrl.set(user?.picture);
      }
    });
  }
}
