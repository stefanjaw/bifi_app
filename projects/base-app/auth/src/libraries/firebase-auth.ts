import { IAuthService } from '../interfaces/auth-service';
import { FirebaseSession } from '../interfaces/session-user';
import { computed, DestroyRef, inject, Injector, signal } from '@angular/core';
import {
  Auth,
  authState,
  idToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import type { User, UserCredential } from 'firebase/auth';
import {
  catchError,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { APP_BACKEND_AUTH_SERVICE } from './providers/backend-auth-provider';
import { IBackendAuthService } from '../interfaces/backend-auth-service';
import { ToastManager } from '@avalantec/base-app/core';
import { user } from '@avalantec/base-app/interfaces';

type AuthenticateFnParams =
  | {
      method: 'google';
    }
  | {
      method: 'login';
      params: {
        email: string;
        password: string;
      };
    }
  | {
      method: 'register';
      params: {
        email: string;
        password: string;
      };
    };

export class FirebaseAuth<TUser extends user> extends IAuthService<TUser, FirebaseSession<TUser>> {
  public readonly authClient = inject(Auth);
  private backendAuth: IBackendAuthService<TUser> = inject(APP_BACKEND_AUTH_SERVICE);
  private destroy$ = inject(DestroyRef);
  private injector = inject(Injector);
  private toastManager = inject(ToastManager);

  /** Session signal, undefined state means that the user state has not yet been loaded */
  private _session = signal<FirebaseSession<TUser> | null | undefined>(undefined);

  /** Public access readonly session signal */
  public session = computed(() => this._session() || null);
  public user = computed(() => this._session()?.appUser || null);

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  idToken$ = idToken(this.authClient);

  get authStateReady$(): Observable<void> {
    return toObservable(this._session, { injector: this.injector })
      .pipe(filter(user => user !== undefined))
      .pipe(map(() => void 0));
  }

  get authStateReady(): Promise<void> {
    return firstValueFrom(this.authStateReady$);
  }

  constructor() {
    super();

    setPersistence(this.authClient, browserLocalPersistence);

    authState(this.authClient)
      .pipe(
        takeUntilDestroyed(this.destroy$),
        tap(() => {
          this.isLoading.set(true);
          this._session.set(undefined);
        }),
        distinctUntilChanged((a, b) => (a?.uid ?? null) === (b?.uid ?? null)),
        switchMap(firebaseUser => this.meRequest(firebaseUser)),
        catchError(() => {
          this._session.set(null);
          return of(null);
        })
      )
      .subscribe({
        next: async session => {
          if (!session || !session.fireUser || !session.appUser) {
            this._session.set(null);
          } else {
            this._session.set({
              fireUser: session.fireUser,
              appUser: session.appUser,
            });

            this.toastManager?.showSuccess('Successfully logged in');
          }

          this.isLoading.set(false);
        },
      });
  }

  private meRequest(
    firebaseUser: User | null
  ): Observable<{ fireUser: User; appUser: TUser | null } | null> {
    if (!firebaseUser) {
      return of(null);
    }

    return this.backendAuth.getMe().pipe(
      catchError(err => {
        this.toastManager.showError(err.message);
        signOut(this.authClient);
        return of(null);
      }),
      takeUntilDestroyed(this.destroy$),
      map(user => ({ fireUser: firebaseUser, appUser: user }))
    );
  }

  async logout(): Promise<boolean> {
    this._session.set(null);
    await signOut(this.authClient);
    return Promise.resolve(true);
  }

  register(payload: { email: string; password: string }): Promise<boolean> {
    return this.authenticate({
      method: 'register',
      params: payload,
    });
  }

  login(payload: { email: string; password: string }): Promise<boolean> {
    return this.authenticate({
      method: 'login',
      params: payload,
    });
  }

  async signWithGoogle(): Promise<boolean> {
    return this.authenticate({
      method: 'google',
    });
  }

  clearError() {
    this.error.set(null);
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    return await sendPasswordResetEmail(this.authClient, email);
  }

  private async authenticate(payload: AuthenticateFnParams): Promise<boolean> {
    try {
      let credentials: UserCredential;

      this._session.set(undefined);

      switch (payload.method) {
        case 'google':
          credentials = await signInWithPopup(this.authClient, new GoogleAuthProvider());
          break;
        case 'register':
          credentials = await createUserWithEmailAndPassword(
            this.authClient,
            payload.params.email,
            payload.params.password
          );
          break;
        default:
          credentials = await signInWithEmailAndPassword(
            this.authClient,
            payload.params.email,
            payload.params.password
          );
          break;
      }

      if (!credentials.user) throw new Error('User not found');

      await this.authStateReady;

      return true;
    } catch (error: any) {
      this.toastManager.showError('Authentication error: ' + error?.message || error);

      if ('message' in error) {
        this.error.set(error.message);
      }

      return Promise.resolve(false);
    }
  }

  isAuthenticated(): boolean {
    return this._session() !== null && this._session() !== undefined;
  }
}
