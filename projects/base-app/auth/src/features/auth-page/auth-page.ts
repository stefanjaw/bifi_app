import { Component, input, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthForm } from '../../ui/auth-form/auth-form';
import { authSocialProvider } from '../../interfaces/auth-social-provider';
import { ToastManager } from '@avalantec/base-app/core';
import { authFormState } from '../../interfaces/auth-form-state';
import { authFormModel } from '../../services/auth-form';
import { APP_FRONTEND_AUTH_SERVICE } from '../../libraries/providers/frontend-auth-provider';

@Component({
  selector: 'bifi-app-auth-page',
  imports: [AuthForm],
  templateUrl: './auth-page.html',
})
export class AuthPage {
  private authService = inject(APP_FRONTEND_AUTH_SERVICE);
  private router = inject(Router);
  private toastManager = inject(ToastManager);

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

  /**
   * Handles the form submission and performs the appropriate action (login or register).
   * If the operation is successful, a success toast is shown and the user is redirected to the
   * dashboard or the intended route. If the operation fails, an error toast is shown.
   * @param formValue The form values from the submission.
   */
  async handleSubmit(formValue: authFormModel) {
    const isLogin = this.isLogin();

    let result;

    // Login or register
    if (isLogin) {
      result = await this.authService.login({
        email: formValue.emailOrUsername,
        password: formValue.password,
      });
    } else {
      result = await this.authService.register({
        email: formValue.emailOrUsername,
        password: formValue.password,
      });
    }

    if (!result) {
      this.toastManager.showError(
        'Operation failed',
        isLogin ? 'Login failed' : 'Registration failed'
      );
      return;
    }

    // Handle result
    this.toastManager.showSuccess(
      'Operation successful!',
      isLogin ? 'Welcome back!' : 'Registration successful!'
    );
  }

  /**
   * Handles the social login action.
   *
   * It attempts to sign in with the specified provider. If the operation is successful,
   * it shows a success toast and navigates to the dashboard. If the operation fails,
   * it shows an error toast. If the provider is not supported, it does nothing.
   * @param provider The name of the provider to use for the social login.
   * @example handleSocialLogin('google')
   */
  async handleSocialLogin(provider: string) {
    const success = await this.socialProviders()
      .find(p => p.name.toLowerCase() === provider.toLowerCase())
      ?.action();

    if (!success) {
      this.toastManager.showError(`Failed to sign in with ${provider}`, 'Error');
      return;
    }

    this.toastManager.showSuccess(`Signed in with ${provider} successfully`, 'Success');
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
