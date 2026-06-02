import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Observable } from 'rxjs';
import { subscriber } from '../interfaces/subscriber';

@Injectable({
  providedIn: 'root',
})
export class CrudSubscribers extends ApiRequestManager<subscriber> {
  constructor() {
    super();
    super.endpoint = 'subscribers';
  }

  importFromContacts(
    listId: string,
    contactIds?: string[]
  ): Observable<{ imported: number; skipped: number }> {
    return this._httpClient.post<{ imported: number; skipped: number }>(
      `${this._apiURL}/${this.endpoint}/import-from-contacts`,
      { listId, contactIds }
    );
  }
}
