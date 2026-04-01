import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface CreateTaskFormModel {
  name: string;
  description?: string;
  typeId?: string;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  progress?: number;
  parentId?: string;
  projectId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CreateTaskForm extends BaseForm<CreateTaskFormModel> {
  override createForm() {
    return this.fb.group<CreateTaskFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      typeId: ['', [Validators.required]],
      plannedStartDate: [undefined],
      plannedEndDate: [undefined],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      parentId: [''],
      projectId: [''],
    });
  }

  override reset(): void {
    super.reset();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.patchValue({ plannedStartDate: today, plannedEndDate: tomorrow });
  }
}
