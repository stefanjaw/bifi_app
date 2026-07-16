import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for recurrent task create/edit */
export interface RecurrentTaskFormModel {
  _id: string;
  startDate: string;
  endDate: string;
  deltaTime: number;
  type: string;
  repetitionTimes: number;
  repetitionLapse: number;
  repetitionSequence: string;
  repetitionDays: string[];
  parentId: string;
}

/** Form service for recurrent task create/edit */
@Injectable({ providedIn: 'root' })
export class RecurrentTaskForm extends BaseForm<RecurrentTaskFormModel> {
  override createForm() {
    return this.fb.group<RecurrentTaskFormModel>({
      _id: [''],
      startDate: [''],
      endDate: [''],
      deltaTime: [5],
      type: [''],
      repetitionTimes: [100],
      repetitionLapse: [1],
      repetitionSequence: ['daily'],
      repetitionDays: { template: [''], formArrayElements: [] },
      parentId: [''],
    });
  }
}
