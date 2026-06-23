import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface WarehouseFormModel {
  name: string;
  code: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class WarehouseFormService extends BaseForm<WarehouseFormModel> {
  override createForm() {
    return this.fb.group<WarehouseFormModel>({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      address: [''],
    });
  }
}
