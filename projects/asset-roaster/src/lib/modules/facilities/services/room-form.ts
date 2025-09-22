import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface RoomFormModel {
  name: string;
  code: string;
  address: string;
  facilityId: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoomForm extends BaseForm<RoomFormModel> {
  override createForm() {
    return this.fb.group<RoomFormModel>({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      address: ['', [Validators.required]],
      facilityId: ['', [Validators.required]],
    });
  }
}
