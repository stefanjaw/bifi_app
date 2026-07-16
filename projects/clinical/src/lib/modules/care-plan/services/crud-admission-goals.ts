import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { admissionGoal } from '../interfaces/care-plan';

/** CRUD service for admission goals */
@Injectable({ providedIn: 'root' })
export class CrudAdmissionGoals extends ApiRequestManager<admissionGoal> {
  constructor() {
    super();
    this.endpoint = 'admission-goals';
  }
}
