import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface ExchangeRateFormModel {
  fromCurrencyId: string;
  toCurrencyId: string;
  rate: number;
  effectiveDate: Date | null;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class ExchangeRateFormService extends BaseForm<ExchangeRateFormModel> {
  override createForm() {
    return this.fb.group<ExchangeRateFormModel>({
      fromCurrencyId: ['', [Validators.required]],
      toCurrencyId: ['', [Validators.required]],
      rate: [1, [Validators.required, Validators.min(0)]],
      effectiveDate: [null, [Validators.required]],
      active: [true],
    });
  }
}
