import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface FacilityFormModel {
  name: string;
  mainPlace: string;
}

@Injectable({
  providedIn: 'root',
})
export class FacilityForm extends BaseForm<FacilityFormModel> {
  override createForm() {
    return this.fb.group<FacilityFormModel>({
      name: ['', [Validators.required]],
      mainPlace: ['', [Validators.required]],
    });
  }
}
