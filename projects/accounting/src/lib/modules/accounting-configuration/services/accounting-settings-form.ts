import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface AccountingSettingsFormModel {
  invoiceSequence: string;
  purchasePayableAccountId: string;
  discountGrantedAccountId: string;
  inventoryAccounts: {
    inventoryAccountId: string;
    cogsAccountId: string;
    adjustmentLossAccountId: string;
    apPendingAccountId: string;
    defaultCurrencyId: string;
  };
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
      discountGrantedAccountId: [''],
      inventoryAccounts: {
        inventoryAccountId: [''],
        cogsAccountId: [''],
        adjustmentLossAccountId: [''],
        apPendingAccountId: [''],
        defaultCurrencyId: [''],
      },
      description: [''],
    });
  }
}
