import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Feature routes for progress notes, notes, and progress note tags */
export const PROGRESS_NOTES_ROUTES: Routes = [
  {
    path: 'progress-notes',
    canActivate: [permissionGuard],
    data: { resource: 'progress-notes/list' },
    loadComponent: () =>
      import('../features/progress-notes-list/progress-notes-list').then(m => m.ProgressNotesList),
  },
  {
    path: 'notes',
    canActivate: [permissionGuard],
    data: { resource: 'notes/list' },
    loadComponent: () => import('../features/notes-list/notes-list').then(m => m.NotesList),
  },
  {
    path: 'progress-note-tags',
    canActivate: [permissionGuard],
    data: { resource: 'progress-note-tags/list' },
    loadComponent: () =>
      import('../features/progress-note-tags-list/progress-note-tags-list').then(
        m => m.ProgressNoteTagsList
      ),
  },
];
