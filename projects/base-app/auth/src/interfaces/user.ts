export type FirebaseUser = firebase.default.User;

export interface AppBaseUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}

export interface Session<TUser = AppBaseUser> {
  appUser: TUser;
}

export interface FirebaseSession<TUser = AppBaseUser> extends Session<TUser> {
  fireUser: FirebaseUser;
  appUser: TUser;
}
