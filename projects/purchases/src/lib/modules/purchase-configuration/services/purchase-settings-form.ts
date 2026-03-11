import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface PurchaseSettingsFormModel {
  purchaseSequence: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class PurchaseSettingsForm extends BaseForm<PurchaseSettingsFormModel> {
  override createForm() {
    return this.fb.group<PurchaseSettingsFormModel>({
      purchaseSequence: [''],
      description: [''],
    });
  }
}
