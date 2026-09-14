import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface AccountingSettingsFormModel {
  invoiceSequence: string;
  purchasePayableAccountId: string;
  description: string;
}

/**
 * Form service for the accounting configuration page (singleton settings).
 */
@Injectable({ providedIn: 'root' })
export class AccountingSettingsForm extends BaseForm<AccountingSettingsFormModel> {
  override createForm() {
    return this.fb.group<AccountingSettingsFormModel>({
      invoiceSequence: [''],
      purchasePayableAccountId: [''],
      description: [''],
    });
  }
}
