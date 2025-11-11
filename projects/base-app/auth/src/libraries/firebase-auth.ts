import { IAuthService } from '../interfaces/auth-service';
import { FirebaseSession } from '../interfaces/session-user';
import { computed, DestroyRef, inject, Injector, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
import { GoogleAuthProvider } from '@angular/fire/auth';
import { IBackendAuthService } from '../interfaces/backend-auth-service';
import firebase from 'firebase/compat/app';
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
  public readonly authClient = inject(AngularFireAuth);
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

  idToken$ = this.authClient.idToken;

  get authStateReady$(): Observable<void> {
    return toObservable(this._session, { injector: this.injector })
      .pipe(filter(user => user !== undefined))
      .pipe(map(() => void 0));
  }

  get authStateReady(): Promise<void> {
    return firstValueFrom(this.authStateReady$);
  }

  /**
   * Initialize the Firebase authentication with the LOCAL persistence.
   *
   * Listens to the authentication state changes and updates the session observable.
   * The session observable is set to undefined when the state changes,
   * and then set to the new session when the session is loaded from the backend.
   *
   * If the user is not logged in or the session is not loaded from the backend,
   * the session observable is set to null.
   *
   * If there is an error when loading the session, the session observable is set to null
   * and the error is logged to the console.
   */
  constructor() {
    super();

    this.authClient.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    this.authClient.authState
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

  /**
   * Handles the authentication state changes by making a request to the backend to
   * fetch the user object and returning a {@link Session} object.
   *
   * @param firebaseUser The Firebase user object.
   *
   * @returns An observable that emits a {@link Session} object.
   */
  private meRequest(
    firebaseUser: firebase.User | null
  ): Observable<{ fireUser: firebase.User; appUser: TUser | null } | null> {
    if (!firebaseUser) {
      return of(null);
    }

    return this.backendAuth.getMe().pipe(
      catchError(err => {
        // If the user is not found, we return an empty object
        this.toastManager.showError(err.message);
        // Sign out from Firebase as well in this case
        this.authClient.signOut();

        return of(null);
      }),
      takeUntilDestroyed(this.destroy$),
      map(user => ({ fireUser: firebaseUser, appUser: user }))
    );
  }

  async logout(): Promise<boolean> {
    this._session.set(null);
    await this.authClient.signOut();
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

  //
  async sendResetPasswordEmail(email: string): Promise<void> {
    return await this.authClient.sendPasswordResetEmail(email);
  }

  /**
   * Authenticates a user based on the specified method and parameters.
   *
   * This function handles different authentication methods such as Google sign-in,
   * email/password registration, and email/password login. It interacts with Firebase
   * authentication services to perform the desired authentication and updates the
   * session state accordingly.
   *
   * @param {AuthenticateFnParams} payload - The authentication method and parameters.
   *        - `method`: The authentication method ('google', 'register', or default to 'login').
   *        - `params`: The parameters required for the authentication method.
   *          - `email`: The user's email (for 'register' and default 'login' methods).
   *          - `password`: The user's password (for 'register' and default 'login' methods).
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if authentication
   *          is successful, and `false` otherwise.
   *
   * @throws {Error} Throws an error if the user is not found during authentication.
   */
  private async authenticate(payload: AuthenticateFnParams): Promise<boolean> {
    try {
      let credentials: firebase.auth.UserCredential;

      this._session.set(undefined);

      switch (payload.method) {
        case 'google':
          credentials = await this.authClient.signInWithPopup(new GoogleAuthProvider());
          break;
        case 'register':
          credentials = await this.authClient.createUserWithEmailAndPassword(
            payload.params.email,
            payload.params.password
          );
          break;
        default:
          credentials = await this.authClient.signInWithEmailAndPassword(
            payload.params.email,
            payload.params.password
          );
          break;
      }

      if (!credentials.user) throw new Error('User not found');

      // wait for the auth state to be ready
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

  /**
   * Returns true if the user is authenticated and false otherwise.
   *
   * This property is a shortcut to check if the user is authenticated.
   * It returns true if the session is not null and not undefined.
   */
  isAuthenticated(): boolean {
    return this._session() !== null && this._session() !== undefined;
  }
}
