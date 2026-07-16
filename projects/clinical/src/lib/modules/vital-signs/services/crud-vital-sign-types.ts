import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { vitalSignType } from '../interfaces/vital-signs';

/** CRUD service for managing vital sign types */
@Injectable({ providedIn: 'root' })
export class CrudVitalSignTypes extends ApiRequestManager<vitalSignType> {
  constructor() {
    super();
    this.endpoint = 'vital-sign-types';
  }
}
