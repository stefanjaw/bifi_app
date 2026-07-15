import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface CurrencyFormModel {
  name: string;
  code: string;
  symbol: string;
  decimalPrecision: number;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class CurrencyFormService extends BaseForm<CurrencyFormModel> {
  override createForm() {
    return this.fb.group<CurrencyFormModel>({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      symbol: ['', [Validators.required]],
      decimalPrecision: [2],
      active: [true],
    });
  }
}
