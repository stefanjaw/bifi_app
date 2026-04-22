import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface SalesOrderStageFormModel {
  name: string;
  description: string;
  color: string;
  order: number;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SalesOrderStageForm extends BaseForm<SalesOrderStageFormModel> {
  override createForm() {
    return this.fb.group<SalesOrderStageFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      color: ['#6366f1'],
      order: [0],
      isDefault: [false],
    });
  }
}
