import { IAuthService } from '../interfaces/auth-service';
import { FirebaseSession } from '../interfaces/user';
import { computed, DestroyRef, inject, Injector, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  catchError,
  EMPTY,
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

export class FirebaseAuth<TUser> implements IAuthService<TUser, FirebaseSession<TUser>> {
  private fireAuth = inject(AngularFireAuth);
  private backendAuth: IBackendAuthService<TUser> = inject(APP_BACKEND_AUTH_SERVICE);
  private destroy$ = inject(DestroyRef);
  private injector = inject(Injector);

  /** Session signal, undefined state means that the user state has not yet been loaded */
  private _session = signal<FirebaseSession<TUser> | null | undefined>(undefined);
  /** Public access readonly session signal */
  public session = computed(() => this._session() || null);
  public user = computed(() => this._session()?.appUser || null);

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  get authStateReady$(): Observable<void> {
    return toObservable(this._session, { injector: this.injector })
      .pipe(filter(user => user !== undefined))
      .pipe(map(() => void 0));
  }

  get authStateReady(): Promise<void> {
    return firstValueFrom(this.authStateReady$);
  }

  constructor() {
    this.fireAuth.authState
      .pipe(
        takeUntilDestroyed(this.destroy$),
        tap(() => {
          this.isLoading.set(true);
          this._session.set(undefined);
        }),
        switchMap(_fireUser =>
          this.backendAuth.getMe().pipe(
            catchError(() => {
              console.log('me endpoint failed');
              return of(null);
            }),
            map(user => {
              console.log('mapping user');
              return { fireUser: _fireUser, appUser: user };
            })
          )
        )
      )
      .pipe(
        catchError(() => {
          this.isLoading.set(false);
          return EMPTY;
        })
      )
      .subscribe(session => {
        console.log('UPDATING SESSION VALUE', session);
        if (!session.fireUser || !session.appUser) {
          this._session.set(null);
        } else {
          this._session.set({
            fireUser: session.fireUser,
            appUser: session.appUser,
          });
        }

        this.isLoading.set(false);
      });
  }

  logout(): Promise<boolean> {
    this._session.set(null);
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

  private async authenticate(payload: AuthenticateFnParams): Promise<boolean> {
    try {
      let credentials: firebase.default.auth.UserCredential;

      console.log('signin in...');
      switch (payload.method) {
        case 'google':
          credentials = await this.fireAuth.signInWithPopup(new GoogleAuthProvider());
          break;
        case 'register':
          credentials = await this.fireAuth.createUserWithEmailAndPassword(
            payload.params.email,
            payload.params.password
          );
          break;
        default:
          credentials = await this.fireAuth.signInWithEmailAndPassword(
            payload.params.email,
            payload.params.password
          );
          break;
      }

      console.log('credentials', credentials);
      if (!credentials.user) {
        console.log("credentials user doesn't exist");
        throw new Error('User not found');
      }

      // return new Promise(resolve => {
      //   this.backendAuth
      //     .syncUser()
      //     .pipe(takeUntilDestroyed(this.destroy$))
      //     .pipe(
      //       catchError(error => {
      //         throw error;
      //       })
      //     )
      //     .subscribe(loggedUser => {
      //       const session: FirebaseSession<TUser> = {
      //         fireUser: credentials.user!,
      //         appUser: loggedUser,
      //       };

      //       this._session.set(session);
      //       resolve(true);
      //     });
      // });

      // wait for the auth state to be ready
      await this.authStateReady;

      return true;
    } catch (error: any) {
      alert('something went wrong logging in');
      if ('message' in error) {
        this.error.set(error.message);
      }
      console.log(error);
      return Promise.resolve(false);
    }
  }
}
