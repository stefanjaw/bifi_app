import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface CountryFormModel {
  name: string;
  code: string;
  currencyCode: string;
  currencySymbol: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountryForm extends BaseForm<CountryFormModel> {
  override createForm() {
    return this.fb.group<CountryFormModel>({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      currencyCode: ['', [Validators.required]],
      currencySymbol: ['', [Validators.required]],
    });
  }
}
