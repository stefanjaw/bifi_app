import { Component, input, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthForm } from '../../ui/auth-form/auth-form';
import type { authFormData, authFormModel, socialProvider } from '../../interfaces/auth.model';
import { APP_AUTH_SERVICE } from '@avalantec/asset-roaster/providers';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'bifi-app-auth-page',
  imports: [AuthForm],
  templateUrl: './auth-page.html',
})
export class AuthPage {
  private authService = inject(APP_AUTH_SERVICE);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // Input
  isLogin = input<boolean>(true);

  // Internal state
  private successMessage = signal<string | null>(null);

  // Computed values
  formData = computed<authFormData>(() => ({
    isLogin: this.isLogin(),
    isLoading: this.authService.isLoading(),
    error: this.authService.error(),
  }));

  socialProviders = computed<socialProvider[]>(() => [
    {
      name: 'Google',
      icon: 'pi pi-google',
      ariaLabel: this.isLogin() ? 'Sign in with Google' : 'Sign up with Google',
    },
    {
      name: 'Microsoft',
      icon: 'pi pi-microsoft',
      ariaLabel: this.isLogin() ? 'Sign in with Microsoft' : 'Sign up with Microsoft',
    },
  ]);

  async handleSubmit(formValue: authFormModel) {
    try {
      if (this.isLogin()) {
        const result = await this.authService.login({
          email: formValue.emailOrUsername,
          password: formValue.password,
        });

        if (result) {
          this.successMessage.set('Login successful!');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login successful!',
          });

          // Navigate to dashboard or intended route
          this.router.navigate(['/asset-roaster/equipment/list']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login failed' });
          this.successMessage.set(null);
        }
      } else {
        const result = await this.authService.register({
          email: formValue.emailOrUsername,
          password: formValue.password,
        });

        if (result) {
          this.successMessage.set('Registration successful!');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Registration successful!',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Registration failed',
          });
          this.successMessage.set(null);
        }
        // Switch to login mode after successful registration
        setTimeout(() => {
          this.router.navigate(['/auth/singin']);
          this.successMessage.set(null);
        }, 3000);
      }
    } catch (error) {
      // Error is handled by the service
      console.error('Authentication error:', error);
    }
  }

  async handleSocialLogin(provider: string) {
    try {
      if (provider === 'google') {
        console.log('signing in with google');
        const success = await this.authService.signWithGoogle();
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Signed in with Google successfully',
          });
          this.router.navigate(['/asset-roaster/equipment/list']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to sign in with Google',
          });
        }
      }
    } catch (error) {
      console.error('Social login error:', error);
    }
  }

  handleToggleMode() {
    if (this.isLogin()) {
      this.router.navigate(['/asset-roaster/auth/signup']);
    } else {
      this.router.navigate(['/asset-roaster/auth/singin']);
    }

    this.authService.clearError();
    this.successMessage.set(null);
  }

  get currentSuccessMessage() {
    return this.successMessage();
  }
}

export default AuthPage;
