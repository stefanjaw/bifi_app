import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface InvoiceLineFormModel {
  lineType: string;
  productId: string;
  description: string;
  accountId: string;
  quantity: number;
  unitPrice: number;
  taxIds: any;
  discountId: string;
  debit: number;
  credit: number;
}

export interface InvoiceFormModel {
  contactId: string;
  paymentTermId: string;
  invoiceDate: Date | null;
  dueDate: Date | null;
  journalId: string;
  paymentReference: string;
  currencyId: string;
  lines: InvoiceLineFormModel[];
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceFormService extends BaseForm<InvoiceFormModel> {
  override createForm() {
    return this.fb.group<InvoiceFormModel>({
      contactId: [''],
      paymentTermId: [''],
      invoiceDate: [null, [Validators.required]],
      dueDate: [null],
      journalId: ['', [Validators.required]],
      paymentReference: [''],
      currencyId: ['', [Validators.required]],
      lines: {
        template: {
          lineType: ['product'],
          productId: [''],
          description: [''],
          accountId: ['', [Validators.required]],
          quantity: [1, [Validators.min(0)]],
          unitPrice: [0, [Validators.min(0)]],
          taxIds: [[] as string[]],
          discountId: [''],
          debit: [0, [Validators.min(0)]],
          credit: [0, [Validators.min(0)]],
        },
        formArrayElements: [],
      },
    });
  }

  get linesArray() {
    return this.form.controls.lines;
  }

  get lines(): FormGroup[] {
    return this.linesArray.controls as FormGroup[];
  }

  isProductLine(g: FormGroup): boolean {
    const t = g.get('lineType')?.value;
    return !t || t === 'product';
  }

  addLine() {
    this.linesArray.pushItem({
      lineType: 'product',
      productId: '',
      description: '',
      accountId: '',
      quantity: 1,
      unitPrice: 0,
      taxIds: [],
      discountId: '',
      debit: 0,
      credit: 0,
    });
  }

  removeLine(index: number) {
    this.linesArray.removeAt(index);
  }
}
