import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseForm, ControlsOf } from '@avalantec/base-app/form';

export interface CreateMaintenanceFormModel {
  name: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class CreateMaintenanceForm extends BaseForm<CreateMaintenanceFormModel> {
  constructor() {
    super();
  }

  override createForm(): FormGroup<ControlsOf<CreateMaintenanceFormModel>> {
    return this.fb.group<CreateMaintenanceFormModel>({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
}
