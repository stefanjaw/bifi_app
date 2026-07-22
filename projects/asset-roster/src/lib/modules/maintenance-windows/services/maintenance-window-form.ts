import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, NonWhitespaceValidators } from '@avalantec/base-app/form';
import { maintenanceWindow } from '../interfaces/maintenance-window';

export interface MaintenanceWindowFormModel {
  name: string;
  daysBefore: number;
  daysAfter: number;
  recurrency: maintenanceWindow['recurrency'];
}

@Injectable({
  providedIn: 'root',
})
export class MaintenanceWindowForm extends BaseForm<MaintenanceWindowFormModel> {
  override createForm() {
    return this.fb.group<MaintenanceWindowFormModel>({
      name: ['', [NonWhitespaceValidators.nonWhitespaceRequired]],
      daysBefore: [1, [Validators.required, Validators.min(1)]],
      daysAfter: [1, [Validators.required, Validators.min(1)]],
      recurrency: ['daily'],
    });
  }
}
