import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface BranchOfficeFormModel {
  companyId: string;
  name: string;
  branchCode: string;
  address: string;
  phone: string;
  email: string;
  countryId: string;
  active: boolean;
  isDefault: boolean;
}

@Injectable({ providedIn: 'root' })
export class BranchOfficeFormService extends BaseForm<BranchOfficeFormModel> {
  override createForm() {
    return this.fb.group<BranchOfficeFormModel>({
      companyId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      branchCode: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: [''],
      email: [''],
      countryId: [''],
      active: [true],
      isDefault: [false],
    });
  }
}
