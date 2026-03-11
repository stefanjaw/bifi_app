import { filter } from '@avalantec/base-app/resource';
import { journalEntry } from '../interfaces/journal-entry';

export const journalEntryFilters: filter<journalEntry>[] = [
  { field: 'reference', operator: 'like', type: 'string' },
];
