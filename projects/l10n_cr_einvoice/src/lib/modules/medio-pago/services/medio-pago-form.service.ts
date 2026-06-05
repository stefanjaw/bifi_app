import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface MedioPagoFormModel {
  code: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class MedioPagoFormService extends BaseForm<MedioPagoFormModel> {
  override createForm() {
    return this.fb.group<MedioPagoFormModel>({
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
}
