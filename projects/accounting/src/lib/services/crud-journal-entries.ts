import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { journalEntry } from '../interfaces/journal-entry';

@Injectable({
  providedIn: 'root',
})
export class CrudJournalEntries extends ApiRequestManager<journalEntry> {
  constructor() {
    super();
    super.endpoint = 'accounting/journal-entries';
  }
}
