import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { languageRecord } from '../interfaces/language';

/**
 * CRUD service for Language records.
 * Communicates with the /languages backend endpoint.
 */
@Injectable({
  providedIn: 'root',
})
export class CrudLanguages extends ApiRequestManager<languageRecord> {
  constructor() {
    super();
    this.endpoint = 'languages';
  }
}
