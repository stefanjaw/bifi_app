import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface DriveSettingsFormModel {
  serviceAccountKey: string;
}

@Injectable({ providedIn: 'root' })
export class DriveSettingsForm extends BaseForm<DriveSettingsFormModel> {
  override createForm() {
    return this.fb.group<DriveSettingsFormModel>({
      serviceAccountKey: [''],
    });
  }
}
