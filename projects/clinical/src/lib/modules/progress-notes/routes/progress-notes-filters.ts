import { filter } from '@avalantec/base-app/resource';
import { progressNote, note, patientProgressNoteTag } from '../interfaces/progress-notes';

/** Filter configuration for progress notes list */
export const progressNoteFilters: filter<progressNote>[] = [
  { field: 'type', type: 'string' },
  { field: 'progressNoteType', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for notes list */
export const noteFilters: filter<note>[] = [
  { field: 'state', type: 'string' },
  { field: 'type', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for progress note tags list */
export const progressNoteTagFilters: filter<patientProgressNoteTag>[] = [
  { field: 'type', type: 'string' },
  { field: 'active', type: 'boolean' },
];
