import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface SalesTargetFormModel {
  name: string;
  year: number;
  month: number;
  targetAmount: number;
  currency: string;
  salesperson: string;
}

@Injectable({
  providedIn: 'root',
})
export class SalesTargetForm extends BaseForm<SalesTargetFormModel> {
  override createForm() {
    return this.fb.group<SalesTargetFormModel>({
      name: ['', [Validators.required]],
      year: [new Date().getFullYear(), [Validators.required]],
      month: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
      targetAmount: [0, [Validators.required, Validators.min(0.01)]],
      currency: ['USD'],
      salesperson: [''],
    });
  }
}
