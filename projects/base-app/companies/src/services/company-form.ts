import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface CompanyFormModel {
  type: string;
  name: string;
  countryId: string;
  address: string;
  contactId: string;
  defaultCurrencyId: string;
  parentCompany: string;
  branchCode: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CompanyForm extends BaseForm<CompanyFormModel> {
  override createForm() {
    return this.fb.group<CompanyFormModel>({
      type: ['company', [Validators.required]],
      name: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      address: ['', [Validators.required]],
      contactId: ['', [Validators.required]],
      defaultCurrencyId: [''],
      parentCompany: [''],
      branchCode: [''],
      isDefault: [false],
    });
  }
}
