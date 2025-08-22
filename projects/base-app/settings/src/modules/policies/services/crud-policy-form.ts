import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { condition, conditionOperator, policyAction, resource } from '@avalantec/base-app/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface PolicyFormModel {
  name: string;
  resource: resource;
  action: policyAction;
  conditions: { key: string; operator: conditionOperator; value: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class CrudPolicyForm extends BaseForm<PolicyFormModel> {
  override createForm() {
    return this.fb.group<PolicyFormModel>({
      name: ['', [Validators.required]],
      resource: ['', [Validators.required]],
      action: ['read', [Validators.required]],
      conditions: {
        template: {
          key: ['', [Validators.required]],
          operator: ['==', [Validators.required]],
          value: ['', [Validators.required]],
        },
        formArrayElements: [],
      },
    });
  }

  createCondition(condition: condition<string> | undefined = undefined) {
    this.form.controls.conditions.pushItem({
      key: (condition?.key as string) || '',
      operator: condition?.operator || '==',
      value: (condition?.value as string) || '',
    });
  }
}
