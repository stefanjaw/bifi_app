import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { translationRecord } from '../interfaces/translation';

/**
 * CRUD service for Translation records.
 * Communicates with the /translations backend endpoint.
 */
@Injectable({
  providedIn: 'root',
})
export class CrudTranslations extends ApiRequestManager<translationRecord> {
  constructor() {
    super();
    this.endpoint = 'translations';
  }
}
