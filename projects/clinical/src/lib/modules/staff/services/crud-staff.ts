import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { staff } from '../interfaces/staff';

/** CRUD service for managing staff members */
@Injectable({ providedIn: 'root' })
export class CrudStaff extends ApiRequestManager<staff> {
  constructor() {
    super();
    this.endpoint = 'staff';
  }
}
