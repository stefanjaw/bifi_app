import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface ProductFormModel {
  name: string;
  sku: string;
  barcode: string;
  description: string;
  unitOfMeasureId: string;
  productTypeId: string;
  costPrice: number;
  salePrice: number;
  photo: FormUploaderFile[];
  attachments: FormUploaderFile[];
}

@Injectable({ providedIn: 'root' })
export class ProductFormService extends BaseForm<ProductFormModel> {
  override createForm() {
    return this.fb.group<ProductFormModel>({
      name: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      barcode: [''],
      description: [''],
      unitOfMeasureId: [''],
      productTypeId: [''],
      costPrice: [0],
      salePrice: [0],
      photo: {
        template: {
          id: [''],
          file: [null!],
        },
        formArrayElements: [],
      },
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
