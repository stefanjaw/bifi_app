import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface PricingSettingsFormModel {
  estimateSequence: string;
  defaultWharfageBankFeePct: string;
  defaultShippingMethod: string;
  defaultPricingMethod: string;
  defaultMarkupFactor: string;
  defaultMargin: string;
}

export interface FolderRowModel {
  type: 'pricing' | 'freight' | 'config';
  folderId: string;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class PricingSettingsForm extends BaseForm<PricingSettingsFormModel> {
  override createForm() {
    return this.fb.group<PricingSettingsFormModel>({
      estimateSequence: [''],
      defaultWharfageBankFeePct: ['2'],
      defaultShippingMethod: ['sea'],
      defaultPricingMethod: ['markup'],
      defaultMarkupFactor: ['1.3'],
      defaultMargin: ['30'],
    });
  }
}
