import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { maritalStatus } from '../interfaces/settings';

/** CRUD service for managing marital statuses */
@Injectable({ providedIn: 'root' })
export class CrudMaritalStatuses extends ApiRequestManager<maritalStatus> {
  constructor() {
    super();
    this.endpoint = 'marital-statuses';
  }
}
