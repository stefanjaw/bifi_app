import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface PurchaseOrderFormModel {
  contactId: string;
  status: string;
  issueDate: string;
  expectedDeliveryDate: string;
  notes: string;
  stageId: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderForm extends BaseForm<PurchaseOrderFormModel> {
  override createForm() {
    return this.fb.group<PurchaseOrderFormModel>({
      contactId: ['', [Validators.required]],
      status: ['draft'],
      issueDate: [''],
      expectedDeliveryDate: [''],
      notes: [''],
      stageId: [null],
    });
  }
}
