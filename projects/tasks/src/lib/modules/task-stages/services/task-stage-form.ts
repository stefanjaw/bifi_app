import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface TaskStageFormModel {
  name: string;
  description: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskStageForm extends BaseForm<TaskStageFormModel> {
  override createForm() {
    return this.fb.group<TaskStageFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      isDefault: [false],
    });
  }
}
