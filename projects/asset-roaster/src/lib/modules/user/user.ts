import { createAuthServiceToken, FirebaseAuth } from '@avalantec/base-app/auth';
import { Prettify } from '@avalantec/base-app/core';
import { user } from '@avalantec/base-app/settings';

export type abcUser = Prettify<user>;

export type assetRoasterUser = Prettify<
  user & {
    shipments: {
      id: string;
    }[];
  }
>;

export const APP_AUTH_SERVICE = createAuthServiceToken<FirebaseAuth<user>>();
