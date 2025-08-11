import { createAuthServiceToken, FirebaseAuth } from '@avalantec/base-app/auth';
import { user } from '@avalantec/base-app/core';

export const APP_AUTH_SERVICE = createAuthServiceToken<FirebaseAuth<user>>();
