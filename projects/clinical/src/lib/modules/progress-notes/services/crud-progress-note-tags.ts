import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { patientProgressNoteTag } from '../interfaces/progress-notes';

/** CRUD service for managing progress note tags */
@Injectable({ providedIn: 'root' })
export class CrudProgressNoteTags extends ApiRequestManager<patientProgressNoteTag> {
  constructor() {
    super();
    this.endpoint = 'progress-note-tags';
  }
}
