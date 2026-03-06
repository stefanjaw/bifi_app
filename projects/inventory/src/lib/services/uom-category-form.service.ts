import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface UomCategoryFormModel {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class UomCategoryFormService extends BaseForm<UomCategoryFormModel> {
  override createForm() {
    return this.fb.group<UomCategoryFormModel>({
      name: ['', [Validators.required]],
    });
  }
}
