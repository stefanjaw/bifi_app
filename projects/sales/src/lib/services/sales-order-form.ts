import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface SalesOrderFormModel {
  crmId: string;
  contact: string;
  company: string;
  salesperson: string;
  amount: number;
  currency: string;
  closeDate: Date;
  notes: string;
}

@Injectable({
  providedIn: 'root',
})
export class SalesOrderForm extends BaseForm<SalesOrderFormModel> {
  override createForm() {
    return this.fb.group<SalesOrderFormModel>({
      crmId: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      company: ['', [Validators.required]],
      salesperson: [''],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      currency: ['USD'],
      closeDate: [new Date(), [Validators.required]],
      notes: [''],
    });
  }
}
