import { Injectable } from '@angular/core';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface UpdateMaintenanceFormModel {
  notes?: string;
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
