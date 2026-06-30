import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  computed,
  createComponent,
  effect,
  EnvironmentInjector,
  inject,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { injectAuthService } from '@avalantec/base-app/auth';
import { FileResolver } from '@avalantec/base-app/resource';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { BugReportDialog } from '@avalantec/base-app/bug-reporting';
import { TranslationService, languageRecord } from '@avalantec/base-app/translation';
import { user } from '@avalantec/base-app/interfaces';

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
  private appRef = inject(ApplicationRef);
  private envInjector = inject(EnvironmentInjector);
  private http = inject(HttpClient);
  private config = inject(LIBRARY_CONFIG);
  private translationService = inject(TranslationService);

  @ViewChild('userMenu') private userMenu!: Menu;

  private bugReportDialogRef: ReturnType<typeof createComponent<BugReportDialog>> | null = null;

  user = this.authService.user;

  pictureUrl = signal<string | undefined>(undefined);

  /**
   * Computed menu model — rebuilds automatically whenever user, available
   * languages, or active locale change. The language section is always
   * present; items beneath the header are empty until availableLanguages
   * is populated, then appear automatically.
   */
  items = computed<MenuItem[]>(() =>
    this.buildItems(
      this.user(),
      this.translationService.availableLanguages(),
      this.translationService.activeLanguage(),
    )
  );

  constructor() {
    // Resolve avatar URL when the user or their uploaded picture changes
    effect(async () => {
      const u = this.user();

      if (u?.uploadedPictureId) {
        const resolvedFile = await this.fileResolver.resolveFile(
          { id: u.uploadedPictureId },
          'icon'
        );

        if (resolvedFile) this.pictureUrl.set(URL.createObjectURL(resolvedFile));
        else this.pictureUrl.set(u?.picture);
      } else {
        this.pictureUrl.set(u?.picture);
      }
    });

    // Apply the user's saved language preference on login/refresh
    effect(() => {
      const savedLocale = this.user()?.language;
      if (savedLocale && savedLocale !== untracked(() => this.translationService.activeLanguage())) {
        this.translationService.setLanguage(savedLocale);
      }
    });
  }

  /**
   * Opens the popup menu and triggers a language reload so the language
   * section is always up-to-date regardless of APP_INITIALIZER timing.
   */
  openMenu(event: MouseEvent): void {
    this.translationService.loadLanguages();
    this.userMenu.toggle(event);
  }

  /**
   * Builds the full menu item array from current signal values.
   * The language section is always included — the separator and label
   * render even before languages load; items fill in once the signal updates.
   *
   * @param u - Current user record
   * @param langs - Available language records
   * @param active - Currently active locale code
   */
  private buildItems(
    u: user | undefined | null,
    langs: languageRecord[],
    active: string
  ): MenuItem[] {
    return [
      {
        label: u?.email || 'Email not set',
        disabled: true,
        style: { 'font-weight': 'bold', opacity: '0.8' },
      },
      { separator: true },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['settings', 'profile']),
      },
      {
        label: 'Report a Bug',
        icon: 'pi pi-exclamation-circle',
        command: () => {
          if (!this.bugReportDialogRef) {
            this.bugReportDialogRef = createComponent(BugReportDialog, {
              environmentInjector: this.envInjector,
            });
            this.appRef.attachView(this.bugReportDialogRef.hostView);
            document.body.appendChild(this.bugReportDialogRef.location.nativeElement);
          }
          this.bugReportDialogRef.instance.openDialog();
        },
      },
      { separator: true },
      {
        label: 'Log-Out',
        icon: 'pi pi-sign-out',
        command: () => {
          this.authService.logout();
          this.router.navigate(['auth', 'signin']);
        },
      },
      { separator: true },
      {
        label: 'Languages',
        disabled: true,
        style: {
          'font-size': '0.7rem',
          opacity: '0.55',
          'text-transform': 'uppercase',
          'letter-spacing': '0.06em',
        },
      },
      ...langs.map(lang => ({
        label: lang.nativeName,
        icon: lang.locale === active ? 'pi pi-circle-on' : 'pi pi-circle-off',
        command: () => this.selectLanguage(lang.locale),
      })),
    ];
  }

  /**
   * Switches the active locale in TranslationService and persists the
   * preference to the backend via PUT /api/users/me/language.
   * @param locale - The locale code to activate (e.g. "es")
   */
  private selectLanguage(locale: string): void {
    this.translationService.setLanguage(locale);
    this.http
      .put(`${this.config.apiURL}/users/me/language`, { language: locale })
      .subscribe();
  }
}
