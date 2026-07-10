import { tableColumn } from '@avalantec/base-app/resource';
import { journalEntry } from '../interfaces/journal-entry';

export const journalEntryColumns: tableColumn<journalEntry>[] = [
  { field: 'journalId.name', title: 'journal', type: 'text' },
  { field: 'date', title: 'date', type: 'date' },
  { field: 'reference', title: 'reference', type: 'text' },
  { field: 'currencyId.code', title: 'currency', type: 'text' },
  { field: 'status', title: 'status', type: 'text' },
];
