import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface PurchaseStageFormModel {
  name: string;
  description: string;
  color: string;
  order: number;
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseStageForm extends BaseForm<PurchaseStageFormModel> {
  override createForm() {
    return this.fb.group<PurchaseStageFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      color: ['#6366f1'],
      order: [0],
    });
  }
}
