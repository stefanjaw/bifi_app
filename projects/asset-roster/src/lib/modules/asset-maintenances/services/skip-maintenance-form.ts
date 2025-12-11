import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface SkipMaintenanceFormModel {
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SkipMaintenanceForm extends BaseForm<SkipMaintenanceFormModel> {
  override createForm() {
    return this.fb.group<SkipMaintenanceFormModel>({
      notes: [''],
    });
  }
}
