import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';
import { task } from '../interfaces/task';

export interface UpdateTaskFormModel {
  name: string;
  description?: string;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  plannedDuration?: number;
  progress: number;
  stage?: string;
  projectId?: string;
  dependencyIds?: string[];
  parentId?: string;
  priority: task['priority'];
  assigned?: string;
  attachments?: FormUploaderFile[];
}

@Injectable({
  providedIn: 'root',
})
export class UpdateTaskForm extends BaseForm<UpdateTaskFormModel> {
  override createForm() {
    return this.fb.group<UpdateTaskFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      plannedStartDate: [undefined],
      plannedEndDate: [undefined],
      plannedDuration: [0],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      stage: [''],
      projectId: [''],
      dependencyIds: {
        template: ['', [Validators.required]],
        formArrayElements: [],
      },
      parentId: [''],
      priority: ['low'],
      assigned: [''],
      attachments: {
        template: {
          id: [''],
          file: [null!],
        },
        formArrayElements: [],
      },
    });
  }

  addDependency() {
    const dependenciesControl = this.form.controls.dependencyIds;
    dependenciesControl.pushItem('');
  }

  removeDependency(index: number) {
    const dependenciesControl = this.form.controls.dependencyIds;
    dependenciesControl.removeAt(index);
  }
}
