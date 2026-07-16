import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { vitalSign } from '../interfaces/vital-signs';

/** CRUD service for managing vital signs */
@Injectable({ providedIn: 'root' })
export class CrudVitalSigns extends ApiRequestManager<vitalSign> {
  constructor() {
    super();
    this.endpoint = 'vital-signs';
  }
}
