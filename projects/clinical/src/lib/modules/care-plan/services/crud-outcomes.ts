import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { outcome } from '../interfaces/care-plan';

/** CRUD service for outcomes */
@Injectable({ providedIn: 'root' })
export class CrudOutcomes extends ApiRequestManager<outcome> {
  constructor() {
    super();
    this.endpoint = 'outcomes';
  }
}
