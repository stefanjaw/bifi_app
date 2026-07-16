import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { progressNote } from '../interfaces/progress-notes';

/** CRUD service for managing progress notes */
@Injectable({ providedIn: 'root' })
export class CrudProgressNotes extends ApiRequestManager<progressNote> {
  constructor() {
    super();
    this.endpoint = 'progress-notes';
  }
}
