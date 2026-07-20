import { Observable } from 'rxjs';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { IBackendAuthService } from '@avalantec/base-app/auth';
import { user } from '@avalantec/base-app/interfaces';
import { ResourceRef } from '@angular/core';

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

  getProfile() {
    return super.get({
      specificEndpoint: 'profile',
    }) as ResourceRef<TUser>;
  }

  /**
   * Updates the language preference for the current user.
   * @param language - The locale code (e.g. "en", "es")
   * @returns Observable with the update result
   */
  updateLanguage(language: string): Observable<unknown> {
    return this._httpClient.put(`${this.formatFullURL()}/me/language`, { language });
  }
}
