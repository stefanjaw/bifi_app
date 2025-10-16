import { Observable } from 'rxjs';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { IBackendAuthService } from '@avalantec/base-app/auth';
import { user } from '@avalantec/base-app/interfaces';

export class BaseCrudUsers<TUser = user>
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
