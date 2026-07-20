import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { staffGroup } from '../interfaces/staff';

/** CRUD service for managing staff groups */
@Injectable({ providedIn: 'root' })
export class CrudStaffGroups extends ApiRequestManager<staffGroup> {
  constructor() {
    super();
    this.endpoint = 'staff-groups';
  }
}
