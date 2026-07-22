import { Injectable } from '@angular/core';
import { BaseForm, NonWhitespaceValidators } from '@avalantec/base-app/form';

export interface FacilityFormModel {
  name: string;
  contactId: string;
}

@Injectable({
  providedIn: 'root',
})
export class FacilityForm extends BaseForm<FacilityFormModel> {
  override createForm() {
    return this.fb.group<FacilityFormModel>({
      name: ['', [NonWhitespaceValidators.nonWhitespaceRequired]],
      contactId: [''],
    });
  }
}
