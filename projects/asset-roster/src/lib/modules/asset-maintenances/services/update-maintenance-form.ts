import { Injectable } from '@angular/core';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface UpdateMaintenanceFormModel {
  notes?: string;
  cost?: number | null;
  attachments: FormUploaderFile[];
}

@Injectable({ providedIn: 'root' })
export class UpdateMaintenanceForm extends BaseForm<UpdateMaintenanceFormModel> {
  constructor() {
    super();
  }

  override createForm() {
    return this.fb.group<UpdateMaintenanceFormModel>({
      notes: [''],
      cost: [null],
      attachments: {
        template: {
          id: [''],
          file: [null!],
        },
        formArrayElements: [],
      },
    });
  }
}
