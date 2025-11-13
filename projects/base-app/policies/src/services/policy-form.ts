import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';
import { condition, conditionOperator, policyType, resource } from '@avalantec/base-app/interfaces';

export interface PolicyFormModel {
  name: string;
  resource: resource;
  type: policyType;
  conditions: { key: string; operator: conditionOperator; value: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class PolicyForm extends BaseForm<PolicyFormModel> {
  override createForm() {
    return this.fb.group<PolicyFormModel>({
      name: ['', [Validators.required]],
      resource: ['', [Validators.required]],
      type: ['model', [Validators.required]],
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
