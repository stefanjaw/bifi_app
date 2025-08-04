import { EnvironmentProviders, InjectionToken, Provider, ProviderToken } from '@angular/core';
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
  backendAuth: ProviderToken<IBackendAuthService<TUser>>;
}

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

  providers.push({ provide: APP_BACKEND_AUTH_SERVICE, useValue: backendAuth });

  return providers;
};
