import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface ProductTypeFormModel {
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductTypeForm extends BaseForm<ProductTypeFormModel> {
  override createForm() {
    return this.fb.group<ProductTypeFormModel>({
      name: ['', [Validators.required]],
      description: [''],
    });
  }
}
