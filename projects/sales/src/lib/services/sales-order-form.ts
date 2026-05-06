import { Injectable, signal } from '@angular/core';
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
  lineTaxIds = signal<string[][]>([]);

  override createForm() {
    return this.fb.group<SalesOrderFormModel>({
      crmId: [''],
      contact: ['', [Validators.required]],
      company: ['', [Validators.required]],
      salesperson: [''],
      stageId: [''],
      amount: [0],
      currency: ['', [Validators.required]],
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

  override reset() {
    super.reset();
    this.lineTaxIds.set([]);
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
    this.lineTaxIds.update(ids => [...ids, []]);
  }

  removeLineItem(index: number) {
    this.form.controls.lineItems.removeAt(index);
    this.lineTaxIds.update(ids => ids.filter((_, i) => i !== index));
  }

  setLineTaxIds(index: number, taxIds: string[]) {
    this.lineTaxIds.update(current => {
      const next = [...current];
      while (next.length <= index) next.push([]);
      next[index] = taxIds;
      return next;
    });
  }

  /**
   * Clears the line items FormArray and re-populates it from `items`,
   * also restoring the per-line taxIds. Use this when loading an existing order.
   */
  initLineItems(items: Array<Partial<LineItemFormModel> & { taxIds?: string[] }>) {
    const arr = this.form.controls.lineItems;
    while (arr.length > 0) arr.removeAt(0, { emitEvent: false });
    const taxIdsArray: string[][] = [];
    for (const item of items) {
      arr.push(this.createLineItemGroup(item), { emitEvent: false });
      taxIdsArray.push(item.taxIds ?? []);
    }
    arr.updateValueAndValidity();
    this.lineTaxIds.set(taxIdsArray);
  }

  patchLineItems(items: Partial<LineItemFormModel>[]) {
    this.form.controls.lineItems.patchValue(items);
  }
}
