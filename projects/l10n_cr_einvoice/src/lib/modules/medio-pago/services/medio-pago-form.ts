import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface medioPagoFormModel {
  code: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class MedioPagoFormService extends BaseForm<medioPagoFormModel> {
  override createForm() {
    return this.fb.group<medioPagoFormModel>({
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
}
