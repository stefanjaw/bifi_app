import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** A read-by entry tracking user acknowledgement of a progress note */
export interface readByItem {
  userId: string;
  status: string;
}

/** Form model for progress note create/edit */
export interface ProgressNoteFormModel {
  _id: string;
  careContinuumId: string;
  patientId: string;
  contentTitle: string;
  date: string;
  notes: string[];
  readBy: readByItem[];
  byName: string;
  type: string;
  progressNoteType: string;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Form service for progress note create/edit */
@Injectable({ providedIn: 'root' })
export class ProgressNoteForm extends BaseForm<ProgressNoteFormModel> {
  override createForm() {
    return this.fb.group<ProgressNoteFormModel>({
      _id: [''],
      careContinuumId: [''],
      patientId: [''],
      contentTitle: [''],
      date: [''],
      notes: { template: [''], formArrayElements: [] },
      readBy: {
        template: {
          userId: [''],
          status: [''],
        },
        formArrayElements: [],
      },
      byName: [''],
      type: ['note'],
      progressNoteType: ['medical'],
      createdBy: [''],
      updatedBy: [''],
      active: [true],
    });
  }
}
