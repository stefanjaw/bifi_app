import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { medicalAllergy } from '../interfaces/settings';

/** CRUD service for managing medical allergies */
@Injectable({ providedIn: 'root' })
export class CrudMedicalAllergies extends ApiRequestManager<medicalAllergy> {
  constructor() {
    super();
    this.endpoint = 'medical-allergies';
  }
}
