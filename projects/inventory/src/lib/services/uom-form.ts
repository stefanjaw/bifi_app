import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface UomFormModel {
  name: string;
  symbol: string;
  categoryId: string;
}

@Injectable({ providedIn: 'root' })
export class UomFormService extends BaseForm<UomFormModel> {
  override createForm() {
    return this.fb.group<UomFormModel>({
      name: ['', [Validators.required]],
      symbol: [''],
      categoryId: ['', [Validators.required]],
    });
  }
}
