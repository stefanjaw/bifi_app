import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { note } from '../interfaces/progress-notes';

/** CRUD service for managing notes */
@Injectable({ providedIn: 'root' })
export class CrudNotes extends ApiRequestManager<note> {
  constructor() {
    super();
    this.endpoint = 'notes';
  }
}
