import { tableColumn } from '@avalantec/base-app/resource';
import { journalEntry } from '../interfaces/journal-entry';

export const journalEntryColumns: tableColumn<journalEntry>[] = [
  { field: 'journalId.name', title: 'Journal', type: 'text' },
  { field: 'date', title: 'Date', type: 'date' },
  { field: 'reference', title: 'Reference', type: 'text' },
  { field: 'currencyId.code', title: 'Currency', type: 'text' },
  { field: 'status', title: 'Status', type: 'text' },
];
