import { Injectable } from '@angular/core';
import { user } from '../interfaces/user';
import { ApiRequestManager } from '@avalantec/base-app/resource';

@Injectable({
  providedIn: 'root',
})
export class CrudUsers extends ApiRequestManager<user> {
  constructor() {
    super();
    super.endpoint = 'users';
  }
}
