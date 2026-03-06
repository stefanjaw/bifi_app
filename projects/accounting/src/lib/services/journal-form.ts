import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface JournalFormModel {
  name: string;
  code: string;
  journalType: string;
  defaultDebitAccountId: string;
  defaultCreditAccountId: string;
  currencyId: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class JournalFormService extends BaseForm<JournalFormModel> {
  override createForm() {
    return this.fb.group<JournalFormModel>({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      journalType: ['', [Validators.required]],
      defaultDebitAccountId: [''],
      defaultCreditAccountId: [''],
      currencyId: [''],
      active: [true],
    });
  }
}
