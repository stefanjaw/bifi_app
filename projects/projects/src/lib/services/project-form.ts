import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface ProjectFormModel {
  name: string;
  description: string;
  stage: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  contactId?: string;
  parentId?: string;
  dateStart: Date;
  dateEnd: Date;
  sequence: number;
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
      stage: ['', [Validators.required]],
      priority: ['medium', [Validators.required]],
      contactId: [''],
      parentId: [''],
      dateStart: [new Date(), [Validators.required]],
      dateEnd: [new Date(), [Validators.required]],
      sequence: [10],
      active: [true],
    });
  }
}
