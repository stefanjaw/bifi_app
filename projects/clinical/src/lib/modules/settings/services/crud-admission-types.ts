import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { admissionType } from '../interfaces/settings';

/** CRUD service for managing admission types */
@Injectable({ providedIn: 'root' })
export class CrudAdmissionTypes extends ApiRequestManager<admissionType> {
  constructor() {
    super();
    this.endpoint = 'admission-types';
  }
}
