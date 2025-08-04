import { Observable } from 'rxjs';

export interface IBackendAuthService<TUser> {
  syncUser(): Observable<TUser>;
}
