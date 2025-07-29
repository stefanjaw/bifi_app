import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseForm, ControlsOf, FormUploaderFile } from '@avalantec/base-app/form';

export interface UpdateMaintenanceFormModel {
  attachments: FormUploaderFile[];
}

@Injectable({ providedIn: 'root' })
export class UpdateMaintenanceForm extends BaseForm<UpdateMaintenanceFormModel> {
  constructor() {
    super();
  }

  override createForm(): FormGroup<ControlsOf<UpdateMaintenanceFormModel>> {
    return this.fb.group<UpdateMaintenanceFormModel>({
      attachments: {
        formArrayElements: [],
      },
    });
  }
}
