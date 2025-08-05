import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from './user';

export interface IAuthService<TUser, TSession extends Session<TUser> = Session<TUser>> {
  session: Signal<TSession | null>;
  user: Signal<TUser | null>;

  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  authStateReady$: Observable<void>;
  authStateReady: Promise<void>;

  register(payload: unknown): Promise<boolean>;
  login(payload: unknown): Promise<boolean>;
  signWithGoogle(): Promise<boolean>;
  logout(): Promise<boolean>;

  clearError(): void;
}
