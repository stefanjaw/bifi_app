import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ArrayValidators, BaseForm } from '@avalantec/base-app/form';

export interface roleFormModel {
  name: string;
  policies: {
    policyId: string;
    actions: unknown;
  }[];
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
        template: {
          policyId: ['', [Validators.required]],
          actions: [[]],
        },
        validators: [ArrayValidators.minLength(1)],
        formArrayElements: [],
      },
      active: [true],
    });
  }
}
