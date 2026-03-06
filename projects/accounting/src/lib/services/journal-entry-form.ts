import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface JournalEntryLineModel {
  accountId: string;
  description: string;
  debit: number;
  credit: number;
}

export interface JournalEntryFormModel {
  journalId: string;
  date: Date | null;
  reference: string;
  currencyId: string;
  lines: JournalEntryLineModel[];
}

@Injectable({
  providedIn: 'root',
})
export class JournalEntryFormService extends BaseForm<JournalEntryFormModel> {
  override createForm() {
    return this.fb.group<JournalEntryFormModel>({
      journalId: ['', [Validators.required]],
      date: [null, [Validators.required]],
      reference: [''],
      currencyId: ['', [Validators.required]],
      lines: {
        template: {
          accountId: ['', [Validators.required]],
          description: [''],
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

  addLine() {
    this.linesArray.pushItem({ accountId: '', description: '', debit: 0, credit: 0 });
  }

  removeLine(index: number) {
    this.linesArray.removeAt(index);
  }
}
