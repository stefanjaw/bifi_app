import { Injectable } from '@angular/core';
import { User } from '@avalantec/asset-roaster/providers';
import { IBackendAuthService } from '@avalantec/base-app/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService implements IBackendAuthService<User> {
  syncUser(): Observable<User> {
    throw new Error('Method not implemented.');
  }
}
