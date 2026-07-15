import type { User } from 'firebase/auth';

export type FirebaseUser = User;

export interface Session<TUser> {
  appUser: TUser;
}

export interface FirebaseSession<TUser> extends Session<TUser> {
  fireUser: FirebaseUser;
  appUser: TUser;
}
