import { Component, input, inject, computed, DestroyRef, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthForm } from '../../ui/auth-form/auth-form';
import { authSocialProvider } from '../../interfaces/auth-social-provider';
import { authFormState } from '../../interfaces/auth-form-state';
import { authFormModel } from '../../services/auth-form';
import { CrudHealthCheck } from '../../services/crud-health-check';
import { LIB_AUTH_SERVICE } from '../../libraries/providers/auth-service-provider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-auth-page',
  imports: [AuthForm],
  templateUrl: './auth-page.html',
})
export class AuthPage {
  private authService = inject(LIB_AUTH_SERVICE);
  private healthCheck = inject(CrudHealthCheck);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);

  // Input from router
  isLogin = input<boolean>(true);

  // Internal state
  socialProviders = computed<authSocialProvider[]>(() => [
    {
      name: 'Google',
      icon: 'pi pi-google',
      ariaLabel: this.isLogin() ? 'Sign in with Google' : 'Sign up with Google',
      action: () => this.authService.signWithGoogle(),
    },
    {
      name: 'Microsoft',
      icon: 'pi pi-microsoft',
      ariaLabel: this.isLogin() ? 'Sign in with Microsoft' : 'Sign up with Microsoft',
      action: () => Promise.resolve(false), // Placeholder for Microsoft login
    },
  ]);

  // Computed values
  formState = computed<authFormState>(() => ({
    isLogin: this.isLogin(),
    isLoading: this.authService.isLoading(),
    error: this.authService.error(),
  }));

  backendVersion = signal<string>(''); // Placeholder for backend version, can be set after health check

  constructor() {
    this.healthCheck
      .check()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: healthCheck => {
          this.backendVersion.set(healthCheck.version ?? '');
        },
        error: () => {
          this.backendVersion.set('N/A');
        },
      });
  }

  /**
   * Handle form submission.
   *
   * If the user is logging in, attempts to log them in. If the user is
   * registering, attempts to register them.
   *
   * @param formValue The form values: emailOrUsername and password.
   */
  async handleSubmit(formValue: authFormModel) {
    const isLogin = this.isLogin();

    // Login or register
    if (isLogin) {
      await this.authService.login({
        email: formValue.emailOrUsername,
        password: formValue.password,
      });
    } else {
      await this.authService.register({
        email: formValue.emailOrUsername,
        password: formValue.password,
      });
    }

    this.router.navigate(['/home']);
  }

  /**
   * Handles the social login action.
   *
   * It finds the corresponding social provider by name and invokes its action.
   * If the action is successful, a success toast is shown and the user is redirected to the
   * dashboard or the intended route.
   *
   * @param provider The name of the social provider (e.g., 'Google', 'Microsoft').
   */
  async handleSocialLogin(provider: string) {
    await this.socialProviders()
      .find(p => p.name.toLowerCase() === provider.toLowerCase())
      ?.action();

    this.router.navigate(['/home']);
  }

  /**
   * Handles the toggle mode action.
   *
   * If the current mode is login, it navigates to the signup route.
   * If the current mode is signup, it navigates to the signin route.
   * In both cases, it clears the error state.
   */
  handleToggleMode() {
    if (this.isLogin()) {
      this.router.navigate(['auth', 'signup']);
    } else {
      this.router.navigate(['auth', 'signin']);
    }

    this.authService.clearError();
  }
}
