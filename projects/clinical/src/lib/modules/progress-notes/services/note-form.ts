import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for note create/edit */
export interface NoteFormModel {
  _id: string;
  careContinuumId: string;
  progressNoteId: string;
  patientId: string;
  date: string;
  contentBody: string;
  byName: string;
  state: string;
  type: string;
  progressNoteTagIds: string[];
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Form service for note create/edit */
@Injectable({ providedIn: 'root' })
export class NoteForm extends BaseForm<NoteFormModel> {
  override createForm() {
    return this.fb.group<NoteFormModel>({
      _id: [''],
      careContinuumId: [''],
      progressNoteId: [''],
      patientId: [''],
      date: [''],
      contentBody: [''],
      byName: [''],
      state: ['Unread'],
      type: ['note'],
      progressNoteTagIds: { template: [''], formArrayElements: [] },
      createdBy: [''],
      updatedBy: [''],
      active: [true],
    });
  }
}
