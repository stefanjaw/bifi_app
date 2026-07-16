import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { medicalPrecaution } from '../interfaces/settings';

/** CRUD service for managing medical precautions */
@Injectable({ providedIn: 'root' })
export class CrudMedicalPrecautions extends ApiRequestManager<medicalPrecaution> {
  constructor() {
    super();
    this.endpoint = 'medical-precautions';
  }
}
