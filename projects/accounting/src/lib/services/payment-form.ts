import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface PaymentFormModel {
  paymentType: string;
  partnerId: string;
  journalId: string;
  amount: number;
  currencyId: string;
  paymentDate: Date | null;
  reference: string;
  exchangeRate: number;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentFormService extends BaseForm<PaymentFormModel> {
  override createForm() {
    return this.fb.group<PaymentFormModel>({
      paymentType: ['', [Validators.required]],
      partnerId: [''],
      journalId: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0)]],
      currencyId: ['', [Validators.required]],
      paymentDate: [null, [Validators.required]],
      reference: [''],
      exchangeRate: [0],
    });
  }
}
