import { Injectable } from '@angular/core';
import { ApiRequestManager } from '../../../../system';
import { user } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class CrudUsers extends ApiRequestManager<user> {
  constructor() {
    super();
    super.endpoint = 'users';
  }
}
