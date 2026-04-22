import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface LineItemFormModel {
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SalesOrderFormModel {
  crmId: string;
  contact: string;
  company: string;
  salesperson: string;
  stageId: string;
  amount: number;
  currency: string;
  closeDate: Date;
  notes: string;
  lineItems: LineItemFormModel[];
}

@Injectable({
  providedIn: 'root',
})
export class SalesOrderForm extends BaseForm<SalesOrderFormModel> {
  override createForm() {
    return this.fb.group<SalesOrderFormModel>({
      crmId: [''],
      contact: ['', [Validators.required]],
      company: ['', [Validators.required]],
      salesperson: [''],
      stageId: [''],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      currency: ['USD'],
      closeDate: [new Date(), [Validators.required]],
      notes: [''],
      lineItems: {
        template: {
          productId: [''],
          description: [''],
          quantity: [1],
          unitPrice: [0],
          total: [0],
        },
        formArrayElements: [],
      },
    });
  }

  get lineItemsArray() {
    return this.form.controls.lineItems;
  }

  createLineItemGroup(data: Partial<LineItemFormModel> = {}) {
    return this.fb.group<LineItemFormModel>({
      productId: [data.productId ?? ''],
      description: [data.description ?? ''],
      quantity: [data.quantity ?? 1],
      unitPrice: [data.unitPrice ?? 0],
      total: [data.total ?? 0],
    });
  }

  addLineItem() {
    this.form.controls.lineItems.push(this.createLineItemGroup());
  }

  removeLineItem(index: number) {
    this.form.controls.lineItems.removeAt(index);
  }

  patchLineItems(items: Partial<LineItemFormModel>[]) {
    this.form.controls.lineItems.patchValue(items);
  }
}
