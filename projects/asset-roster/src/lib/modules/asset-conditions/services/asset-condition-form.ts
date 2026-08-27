import { Injectable } from '@angular/core';
import { BaseForm, NonWhitespaceValidators } from '@avalantec/base-app/form';

/** Form model describing the controls of an Asset Condition create/edit form. */
export interface AssetConditionFormModel {
  name: string;
  description?: string;
}

/**
 * Form service backing the Asset Condition create/edit form.
 * `name` is required (non-whitespace); `description` is optional.
 */
@Injectable({
  providedIn: 'root',
})
export class AssetConditionForm extends BaseForm<AssetConditionFormModel> {
  override createForm() {
    return this.fb.group<AssetConditionFormModel>({
      name: ['', [NonWhitespaceValidators.nonWhitespaceRequired]],
      description: [''],
    });
  }
}
