import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { contactLabel } from '../interfaces/settings';

/** CRUD service for managing contact labels */
@Injectable({ providedIn: 'root' })
export class CrudContactLabels extends ApiRequestManager<contactLabel> {
  constructor() {
    super();
    this.endpoint = 'contact-labels';
  }
}
