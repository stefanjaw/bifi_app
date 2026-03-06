import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface DiscountFormModel {
  name: string;
  discountType: string;
  value: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DiscountFormService extends BaseForm<DiscountFormModel> {
  override createForm() {
    return this.fb.group<DiscountFormModel>({
      name: ['', [Validators.required]],
      discountType: ['', [Validators.required]],
      value: [0, [Validators.required, Validators.min(0)]],
      active: [true],
    });
  }
}
