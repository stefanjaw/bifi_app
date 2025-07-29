import { Injectable } from '@angular/core';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface UpdateMaintenanceFormModel {
  attachments: FormUploaderFile[];
}

@Injectable({ providedIn: 'root' })
export class UpdateMaintenanceForm extends BaseForm<UpdateMaintenanceFormModel> {
  constructor() {
    super();
  }

  override createForm() {
    return this.fb.group<UpdateMaintenanceFormModel>({
      attachments: {
        template: {
          id: [''],
          file: [],
        },
        formArrayElements: [],
      },
    });
  }
}
