import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseForm, ControlsOf, NonWhitespaceValidators } from '@avalantec/base-app/form';

export interface UpdateDecommissioningFormModel {
  details: string;
}

@Injectable({ providedIn: 'root' })
export class UpdateDecommissioningForm extends BaseForm<UpdateDecommissioningFormModel> {
  constructor() {
    super();
  }

  override createForm(): FormGroup<ControlsOf<UpdateDecommissioningFormModel>> {
    return this.fb.group<UpdateDecommissioningFormModel>({
      details: ['', [NonWhitespaceValidators.nonWhitespaceRequired]],
    });
  }
}
