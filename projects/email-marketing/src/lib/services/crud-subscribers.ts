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

  /**
   * Imports contacts from the global contacts directory as subscribers for a mailing list
   * @param listId - The mailing list ID to import into
   * @param contactIds - Optional array of contact IDs to import; imports all if omitted
   * @returns Observable with imported and skipped counts
   */
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
