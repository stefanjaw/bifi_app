import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface AccountingSettingsFormModel {
  invoiceSequence: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class AccountingSettingsForm extends BaseForm<AccountingSettingsFormModel> {
  override createForm() {
    return this.fb.group<AccountingSettingsFormModel>({
      invoiceSequence: [''],
      description: [''],
    });
  }
}
