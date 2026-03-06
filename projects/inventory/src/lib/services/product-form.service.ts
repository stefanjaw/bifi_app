import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface ProductFormModel {
  name: string;
  sku: string;
  description: string;
  unitOfMeasureId: string;
  costPrice: number;
  salePrice: number;
}

@Injectable({ providedIn: 'root' })
export class ProductFormService extends BaseForm<ProductFormModel> {
  override createForm() {
    return this.fb.group<ProductFormModel>({
      name: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      description: [''],
      unitOfMeasureId: [''],
      costPrice: [0],
      salePrice: [0],
    });
  }
}
