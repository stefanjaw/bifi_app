import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';
import { staffIdEntry } from '../interfaces/staff';

/** Form model for staff group create/edit */
export interface StaffGroupFormModel {
  _id: string;
  name: string;
  description: string;
  staffIds: staffIdEntry[];
  active: boolean;
}

/** Form service for staff group create/edit */
@Injectable({ providedIn: 'root' })
export class StaffGroupForm extends BaseForm<StaffGroupFormModel> {
  override createForm() {
    return this.fb.group<StaffGroupFormModel>({
      _id: [''],
      name: [''],
      description: [''],
      staffIds: {
        template: { staffId: [''], role: ['Nurse'] },
        formArrayElements: [],
      },
      active: [true],
    });
  }
}
