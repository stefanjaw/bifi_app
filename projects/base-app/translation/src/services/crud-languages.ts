import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { languageRecord } from '@avalantec/base-app/i18n';

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
