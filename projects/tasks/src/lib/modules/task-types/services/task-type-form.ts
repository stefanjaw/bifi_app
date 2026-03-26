import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface TaskTypeFormModel {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskTypeForm extends BaseForm<TaskTypeFormModel> {
  override createForm() {
    return this.fb.group<TaskTypeFormModel>({
      name: ['', [Validators.required]],
      description: [''],
    });
  }
}
