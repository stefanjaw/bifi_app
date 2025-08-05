import { Observable } from 'rxjs';
import { baseUser } from '../interfaces/user';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { IBackendAuthService } from '@avalantec/base-app/auth';

export class BaseCrudUsers<TUser = baseUser>
  extends ApiRequestManager<TUser>
  implements IBackendAuthService<TUser>
{
  constructor() {
    super();
    this.endpoint = 'users';
  }

  getMe(): Observable<TUser> {
    return this._httpClient.get<TUser>(`${this.formatFullURL()}/me`);
  }
}
