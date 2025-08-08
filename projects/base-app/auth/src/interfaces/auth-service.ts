import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from './session-user';
import { user } from '@avalantec/base-app/settings';

export interface IAuthService<
  TUser extends user,
  TSession extends Session<TUser> = Session<TUser>,
> {
  session: Signal<TSession | null>;
  user: Signal<TUser | null>;

  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  authStateReady$: Observable<void>;
  authStateReady: Promise<void>;

  idToken$: Observable<string | null>;

  register(payload: unknown): Promise<boolean>;
  login(payload: unknown): Promise<boolean>;
  signWithGoogle(): Promise<boolean>;
  logout(): Promise<boolean>;

  clearError(): void;
}
