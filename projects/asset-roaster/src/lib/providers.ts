import { createAuthServiceToken, FirebaseSession } from '@avalantec/base-app/auth';

export interface User {
  name: string;
  lastName: string;
  email: string;
}

export const APP_AUTH_SERVICE = createAuthServiceToken<User, FirebaseSession<User>>();
