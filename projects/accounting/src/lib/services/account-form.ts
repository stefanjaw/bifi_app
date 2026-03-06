import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface AccountFormModel {
  companyId: string;
  code: string;
  name: string;
  type: string;
  parentAccountId: string;
  currencyId: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AccountFormService extends BaseForm<AccountFormModel> {
  override createForm() {
    return this.fb.group<AccountFormModel>({
      companyId: [''],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      parentAccountId: [''],
      currencyId: [''],
      active: [true],
    });
  }
}
