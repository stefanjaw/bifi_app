import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { race } from '../interfaces/settings';

/** CRUD service for managing races */
@Injectable({ providedIn: 'root' })
export class CrudRaces extends ApiRequestManager<race> {
  constructor() {
    super();
    this.endpoint = 'races';
  }
}
