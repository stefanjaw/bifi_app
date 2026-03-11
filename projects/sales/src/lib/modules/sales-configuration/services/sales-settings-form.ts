import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface SalesSettingsFormModel {
  orderSequence: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class SalesSettingsForm extends BaseForm<SalesSettingsFormModel> {
  override createForm() {
    return this.fb.group<SalesSettingsFormModel>({
      orderSequence: [''],
      description: [''],
    });
  }
}
