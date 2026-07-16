import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for progress note tag create/edit */
export interface ProgressNoteTagFormModel {
  _id: string;
  name: string;
  description: string;
  type: string;
  active: boolean;
}

/** Form service for progress note tag create/edit */
@Injectable({ providedIn: 'root' })
export class ProgressNoteTagForm extends BaseForm<ProgressNoteTagFormModel> {
  override createForm() {
    return this.fb.group<ProgressNoteTagFormModel>({
      _id: [''],
      name: [''],
      description: [''],
      type: ['adverse'],
      active: [true],
    });
  }
}
