import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface FiscalPositionTaxMappingModel {
  fromTaxId: string;
  toTaxId: string;
}

export interface FiscalPositionAccountMappingModel {
  fromAccountId: string;
  toAccountId: string;
}

export interface FiscalPositionFormModel {
  name: string;
  active: boolean;
  taxMappings: FiscalPositionTaxMappingModel[];
  accountMappings: FiscalPositionAccountMappingModel[];
}

@Injectable({
  providedIn: 'root',
})
export class FiscalPositionFormService extends BaseForm<FiscalPositionFormModel> {
  override createForm() {
    return this.fb.group<FiscalPositionFormModel>({
      name: ['', [Validators.required]],
      active: [true],
      taxMappings: {
        template: {
          fromTaxId: ['', [Validators.required]],
          toTaxId: ['', [Validators.required]],
        },
        formArrayElements: [],
      },
      accountMappings: {
        template: {
          fromAccountId: ['', [Validators.required]],
          toAccountId: ['', [Validators.required]],
        },
        formArrayElements: [],
      },
    });
  }

  get taxMappingsArray() {
    return this.form.controls.taxMappings;
  }

  get accountMappingsArray() {
    return this.form.controls.accountMappings;
  }

  get taxMappings(): FormGroup[] {
    return this.taxMappingsArray.controls as FormGroup[];
  }

  get accountMappings(): FormGroup[] {
    return this.accountMappingsArray.controls as FormGroup[];
  }

  addTaxMapping() {
    this.taxMappingsArray.pushItem({ fromTaxId: '', toTaxId: '' });
  }

  removeTaxMapping(index: number) {
    this.taxMappingsArray.removeAt(index);
  }

  addAccountMapping() {
    this.accountMappingsArray.pushItem({ fromAccountId: '', toAccountId: '' });
  }

  removeAccountMapping(index: number) {
    this.accountMappingsArray.removeAt(index);
  }
}
