import { Observable } from 'rxjs';

export interface IBackendAuthService<TUser> {
  getMe(): Observable<TUser>;
}
