import { tableColumn } from '@avalantec/base-app/resource';
import { progressNote, note, patientProgressNoteTag } from '../interfaces/progress-notes';

/** Column definitions for progress notes table */
export const progressNoteColumns: tableColumn<progressNote>[] = [
  { field: 'contentTitle', title: 'contentTitle', type: 'text' },
  { field: 'byName', title: 'byName', type: 'text' },
  { field: 'date', title: 'date', type: 'date' },
  { field: 'type', title: 'type', type: 'text' },
  { field: 'progressNoteType', title: 'progressNoteType', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Column definitions for notes table */
export const noteColumns: tableColumn<note>[] = [
  { field: 'contentBody', title: 'contentBody', type: 'text' },
  { field: 'byName', title: 'byName', type: 'text' },
  { field: 'date', title: 'date', type: 'date' },
  { field: 'state', title: 'state', type: 'text' },
  { field: 'type', title: 'type', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Column definitions for progress note tags table */
export const progressNoteTagColumns: tableColumn<patientProgressNoteTag>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  { field: 'type', title: 'type', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];
