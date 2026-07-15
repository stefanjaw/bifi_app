import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Observable } from 'rxjs';
import { journalEntry } from '../interfaces/journal-entry';

@Injectable({
  providedIn: 'root',
})
export class CrudJournalEntries extends ApiRequestManager<journalEntry> {
  constructor() {
    super();
    super.endpoint = 'accounting/journal-entries';
  }

  /**
   * Posts a journal entry, making it final and non-editable
   * @param id - The journal entry ID
   * @returns Observable of the posted journal entry
   */
  postEntry(id: string): Observable<journalEntry | undefined> {
    return this._httpClient.put<journalEntry | undefined>(`${this.formatFullURL()}/${id}/post`, {});
  }
}
