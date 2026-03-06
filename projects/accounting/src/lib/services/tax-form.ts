import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface TaxFormModel {
  name: string;
  taxType: string;
  percentage: number;
  accountId: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaxFormService extends BaseForm<TaxFormModel> {
  override createForm() {
    return this.fb.group<TaxFormModel>({
      name: ['', [Validators.required]],
      taxType: ['', [Validators.required]],
      percentage: [0, [Validators.required, Validators.min(0)]],
      accountId: ['', [Validators.required]],
      active: [true],
    });
  }
}
