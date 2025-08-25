import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface roleFormModel {
  name: string;
  policies: string[];
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoleForm extends BaseForm<roleFormModel> {
  override createForm() {
    return this.fb.group<roleFormModel>({
      name: ['', [Validators.required]],
      policies: {
        template: [''],
        formArrayElements: [],
      },
      active: [true],
    });
  }
}
