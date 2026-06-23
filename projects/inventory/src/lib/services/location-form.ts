import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface LocationFormModel {
  name: string;
  code: string;
  warehouseId: string;
  capacity: number;
}

@Injectable({ providedIn: 'root' })
export class LocationFormService extends BaseForm<LocationFormModel> {
  override createForm() {
    return this.fb.group<LocationFormModel>({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      warehouseId: ['', [Validators.required]],
      capacity: [0],
    });
  }
}
