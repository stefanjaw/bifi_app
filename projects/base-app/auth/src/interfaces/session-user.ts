export type FirebaseUser = firebase.default.User;

export interface Session<TUser> {
  appUser: TUser;
}

export interface FirebaseSession<TUser> extends Session<TUser> {
  fireUser: FirebaseUser;
  appUser: TUser;
}
