import { computed, inject, Injectable } from '@angular/core';
import { Session } from '../interfaces/session-user';
import { LIB_AUTH_SERVICE } from '../libraries/providers/auth-service-provider';
import { IAuthService } from '../interfaces/auth-service';

@Injectable({
  providedIn: 'root',
})
export class AuthState<TSession extends Session<any>> {
  private authService: IAuthService<TSession> = inject(LIB_AUTH_SERVICE);

  session = this.authService.session;
  user = computed(() => this.session()?.appUser);

  authStateReady$ = this.authService.authStateReady$;
}
