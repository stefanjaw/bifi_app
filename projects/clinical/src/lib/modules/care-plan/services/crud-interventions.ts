import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { intervention } from '../interfaces/care-plan';

/** CRUD service for interventions */
@Injectable({ providedIn: 'root' })
export class CrudInterventions extends ApiRequestManager<intervention> {
  constructor() {
    super();
    this.endpoint = 'interventions';
  }
}
