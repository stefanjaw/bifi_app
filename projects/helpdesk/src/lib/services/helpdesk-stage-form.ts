import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface HelpdeskStageFormModel {
  name: string;
  description: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HelpdeskStageForm extends BaseForm<HelpdeskStageFormModel> {
  override createForm() {
    return this.fb.group<HelpdeskStageFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      isDefault: [false],
    });
  }
}
