import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface CondicionVentaFormModel {
  code: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class CondicionVentaFormService extends BaseForm<CondicionVentaFormModel> {
  override createForm() {
    return this.fb.group<CondicionVentaFormModel>({
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
}
