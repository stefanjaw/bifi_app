import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

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
  photo: string | null;
  maintenanceWindowIds: string | null;
  pmScheduleStatus: string;
}

@Injectable({ providedIn: 'root' })
export class UpdateProductForm extends BaseForm<UpdateProductFormModel> {
  constructor() {
    super();
  }

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
      acquiredPrice: [0],
      currentPrice: [0],
      warrantyDate: [null],
      remarks: [null],
      photo: [null],
      maintenanceWindowIds: [null],
      pmScheduleStatus: [
        'This equipment is awaiting commissioning. PM schedule cannot be determined yet.',
      ],
    });
  }
}
