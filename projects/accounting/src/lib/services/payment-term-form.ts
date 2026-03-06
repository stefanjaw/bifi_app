import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface PaymentTermLineModel {
  percentage: number;
  dueDays: number;
}

export interface PaymentTermFormModel {
  name: string;
  active: boolean;
  lines: PaymentTermLineModel[];
}

@Injectable({
  providedIn: 'root',
})
export class PaymentTermFormService extends BaseForm<PaymentTermFormModel> {
  override createForm() {
    return this.fb.group<PaymentTermFormModel>({
      name: ['', [Validators.required]],
      active: [true],
      lines: {
        template: {
          percentage: [0, [Validators.required, Validators.min(0)]],
          dueDays: [0, [Validators.required, Validators.min(0)]],
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

  addLine() {
    this.linesArray.pushItem({ percentage: 0, dueDays: 0 });
  }

  removeLine(index: number) {
    this.linesArray.removeAt(index);
  }
}
