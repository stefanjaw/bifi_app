import { Injectable } from '@angular/core';
import { BaseForm, NonWhitespaceValidators } from '@avalantec/base-app/form';

export interface AssetTypeFormModel {
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AssetTypeForm extends BaseForm<AssetTypeFormModel> {
  override createForm() {
    return this.fb.group<AssetTypeFormModel>({
      name: ['', [NonWhitespaceValidators.nonWhitespaceRequired]],
      description: [''],
    });
  }
}
