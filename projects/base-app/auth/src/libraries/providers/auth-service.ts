import { user } from '@avalantec/base-app/interfaces';
import { createAuthServiceToken } from './auth-service-provider';
import { FirebaseAuth } from '../firebase-auth';

export const APP_AUTH_SERVICE = createAuthServiceToken<FirebaseAuth<user>>();
