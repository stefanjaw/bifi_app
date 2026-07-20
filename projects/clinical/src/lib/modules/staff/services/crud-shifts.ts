import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { shift } from '../interfaces/staff';

/** CRUD service for managing shifts */
@Injectable({ providedIn: 'root' })
export class CrudShifts extends ApiRequestManager<shift> {
  constructor() {
    super();
    this.endpoint = 'shifts';
  }
}
