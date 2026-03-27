import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface ProjectStageFormModel {
  name: string;
  description: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectStageForm extends BaseForm<ProjectStageFormModel> {
  override createForm() {
    return this.fb.group<ProjectStageFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      isDefault: [false],
    });
  }
}
