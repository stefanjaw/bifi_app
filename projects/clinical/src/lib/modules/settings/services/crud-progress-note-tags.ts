import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { progressNoteTag } from '../interfaces/settings';

/** CRUD service for managing progress note tags */
@Injectable({ providedIn: 'root' })
export class CrudSettingsProgressNoteTags extends ApiRequestManager<progressNoteTag> {
  constructor() {
    super();
    this.endpoint = 'progress-note-tags';
  }
}
