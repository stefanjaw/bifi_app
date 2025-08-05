import { EnvironmentProviders, InjectionToken, Provider, Type } from '@angular/core';
import { IAuthService } from '../interfaces/auth-service';
import { IBackendAuthService } from '../interfaces/backend-auth-service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { APP_BACKEND_AUTH_SERVICE } from './providers/backend-auth-provider';
import { FirebaseSession } from '../interfaces/user';
import { LIB_AUTH_SERVICE } from './providers/auth-service-provider';
import { FirebaseAuth } from './firebase-auth';
import { FirebaseRemoteConfigObject } from '@angular/fire/remote-config';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

interface FirebaseAuthProviderSettings<
  TSession extends FirebaseSession<any> = FirebaseSession<any>,
> {
  type: 'FIREBASE';
  token?: InjectionToken<IAuthService<any, TSession>>;
  config: FirebaseRemoteConfigObject;
}

interface CustomAuthProviderSettings<TService extends IAuthService<any> = IAuthService<any>> {
  type: 'CUSTOM';
  token: InjectionToken<TService>;
  value: TService;
}

interface AppAuthSettings<TUser> {
  authProvider: FirebaseAuthProviderSettings | CustomAuthProviderSettings;
  backendAuth: Type<IBackendAuthService<TUser>>;
}

/**
 * Provides authentication-related providers based on the specified authentication settings.
 *
 * @template TUser - The type of user object.
 * @param {AppAuthSettings<TUser>} settings - The authentication settings, which include
 *        the type of authentication provider (Firebase or custom) and the backend
 *        authentication service.
 * @returns {(Provider | EnvironmentProviders)[]} An array of Angular providers configured
 *          based on the authentication settings.
 *
 * - If the `authProvider` type is 'FIREBASE', it initializes Firebase with the provided
 *   configuration, and optionally uses a custom token or the default library service token
 *   to provide the `FirebaseAuth` class.
 *
 * - If the `authProvider` type is 'CUSTOM', it provides the custom authentication service
 *   using the specified token and value.
 *
 * - Additionally, it provides the backend authentication service using the class specified
 *   in the `backendAuth` property.
 */
export const provideAppAuth = <TUser>({
  authProvider,
  backendAuth,
}: AppAuthSettings<TUser>): (Provider | EnvironmentProviders)[] => {
  const providers: (Provider | EnvironmentProviders)[] = [];

  // Firebase provider token
  if (authProvider.type === 'FIREBASE') {
    providers.push({ provide: FIREBASE_OPTIONS, useValue: authProvider.config });
    providers.push(provideFirebaseApp(() => initializeApp(authProvider.config)));

    const token = authProvider.token || LIB_AUTH_SERVICE;
    providers.push({ provide: token, useClass: FirebaseAuth });
  }

  // Custom provider
  if (authProvider.type === 'CUSTOM') {
    providers.push({ provide: authProvider.token, useValue: authProvider.value });
  }

  providers.push({ provide: APP_BACKEND_AUTH_SERVICE, useClass: backendAuth });

  return providers;
};
