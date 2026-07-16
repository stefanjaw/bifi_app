import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { gender } from '../interfaces/settings';

/** CRUD service for managing genders */
@Injectable({ providedIn: 'root' })
export class CrudGenders extends ApiRequestManager<gender> {
  constructor() {
    super();
    this.endpoint = 'genders';
  }
}
