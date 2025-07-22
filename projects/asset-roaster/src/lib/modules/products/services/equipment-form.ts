import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

interface EquipmentFormModel {
  serialNumber: string;
  type: string;
  make: string;
  model: string;
  dateAcquired: string | null;
  vendor: string;
  condition: string | null;
  location: string;
  pricePaid: string | null;
  currentValue: string | null;
  warrantyExpirationDate: string | null;
  remarks: string | null;
  equipmentPhoto: string | null;
  maintenanceInterval: string | null;
  pmScheduleStatus: string;
}

@Injectable()
export class EquipmentForm extends BaseForm<EquipmentFormModel> {
  constructor() {
    super();
  }
  override createForm() {
    return this.fb.group<EquipmentFormModel>({
      serialNumber: ['0010101', [Validators.required]],
      type: ['Test type'],
      make: ['OEMTEST'],
      model: ['TestModel'],
      dateAcquired: ['2025-07-21'],
      vendor: [''],
      condition: [null],
      location: [''],
      pricePaid: [null],
      currentValue: [null],
      warrantyExpirationDate: [null],
      remarks: [null],
      equipmentPhoto: [null],
      maintenanceInterval: [null],
      pmScheduleStatus: [
        'This equipment is awaiting commissioning. PM schedule cannot be determined yet.',
      ],
    });
  }
}
