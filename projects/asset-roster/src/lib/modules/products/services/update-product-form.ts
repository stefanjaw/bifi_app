import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

interface UpdateProductFormModel {
  serialNumber: string;
  productTypeIds: string;
  makeIds: string;
  productModel: string;
  acquiredDate: Date | null;
  vendorIds: string;
  condition: string | null;
  locationId: string;
  acquiredPrice: number | null;
  currentPrice: number | null;
  warrantyDate: Date | null;
  remarks: string | null;
  photo: FormUploaderFile[];
  attachments: FormUploaderFile[];
  attachmentsMetadata: {
    descriptor: string;
  }[];
  maintenanceWindowIds: string | null;
  maintenanceDate: Date | null;
}

@Injectable({ providedIn: 'root' })
export class UpdateProductForm extends BaseForm<UpdateProductFormModel> {
  override createForm() {
    return this.fb.group<UpdateProductFormModel>({
      serialNumber: ['0010101', [Validators.required]],
      productTypeIds: ['Test type'],
      makeIds: ['OEMTEST'],
      productModel: ['TestModel'],
      acquiredDate: [new Date()],
      vendorIds: [''],
      condition: [null],
      locationId: [''],
      acquiredPrice: [null, Validators.min(1)],
      currentPrice: [null, Validators.min(1)],
      warrantyDate: [null],
      remarks: [null],
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
      attachmentsMetadata: {
        template: {
          descriptor: [''],
        },
        formArrayElements: [],
      },
      maintenanceWindowIds: [null],
      maintenanceDate: [null],
    });
  }
}
