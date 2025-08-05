import { user } from '@avalantec/base-app/settings';
import { FirebaseAuth } from '../firebase-auth';
import { createAuthServiceToken } from './auth-service-provider';

export const APP_FRONTEND_AUTH_SERVICE = createAuthServiceToken<FirebaseAuth<user>>();
