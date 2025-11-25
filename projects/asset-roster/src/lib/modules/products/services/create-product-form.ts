import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface CreateProductFormModel {
  productTypeIds: string | null;
  createdType: {
    name: string | null;
    description: string | null;
  };
  makeIds: string | null;
  createdMake: {
    oemName: string | null;
  };
  productModel: string;
  serialNumber: string;
  acquiredDate: Date;
}

@Injectable({ providedIn: 'root' })
export class CreateProductForm extends BaseForm<CreateProductFormModel> {
  override createForm() {
    return this.fb.group<CreateProductFormModel>({
      productTypeIds: [undefined!],
      createdType: {
        name: [null],
        description: [null],
      },
      makeIds: [null],
      createdMake: {
        oemName: [null],
      },
      serialNumber: ['', [Validators.required]],
      productModel: ['', [Validators.required]],
      acquiredDate: [null!, [Validators.required]],
    });
  }
}
