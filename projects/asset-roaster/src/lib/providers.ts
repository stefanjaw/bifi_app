import { createAuthServiceToken, FirebaseAuth } from '@avalantec/base-app/auth';
import { user } from './modules/users/interfaces/user';

export const APP_AUTH_SERVICE = createAuthServiceToken<FirebaseAuth<user>>();
