import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface ProjectFormModel {
  name: string;
  description: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectForm extends BaseForm<ProjectFormModel> {
  override createForm() {
    return this.fb.group<ProjectFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      active: [true],
    });
  }
}
