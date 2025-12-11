import { effect, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface CreateAssetRosterFormModel {
  assetTypeIds: string | null;
  createdType: {
    name: string | null;
    description: string | null;
  };
  makeIds: string | null;
  createdMake: {
    oemName: string | null;
  };
  productModel: string;
  serialNumber: string;
  acquiredDate: Date;
}

@Injectable({ providedIn: 'root' })
export class CreateAssetRosterForm extends BaseForm<CreateAssetRosterFormModel> {
  assetType = toSignal(this.form.controls.assetTypeIds.valueChanges);
  make = toSignal(this.form.controls.makeIds.valueChanges);

  constructor() {
    super();

    effect(() => {
      if (!this.assetType()) {
        this.form.controls.createdType.get('name')?.setValidators([Validators.required]);
        this.form.controls.createdType.get('description')?.setValidators([Validators.required]);
      } else {
        this.form.controls.createdType.get('name')?.clearValidators();
        this.form.controls.createdType.get('description')?.clearValidators();
      }

      this.form.controls.createdType.get('name')?.updateValueAndValidity();
      this.form.controls.createdType.get('description')?.updateValueAndValidity();

      if (!this.make()) {
        this.form.controls.createdMake.get('oemName')?.setValidators([Validators.required]);
      } else {
        this.form.controls.createdMake.get('oemName')?.clearValidators();
      }

      this.form.controls.createdMake.get('oemName')?.updateValueAndValidity();
    });
  }

  override createForm() {
    return this.fb.group<CreateAssetRosterFormModel>({
      assetTypeIds: [undefined!],
      createdType: {
        name: [null],
        description: [null],
      },
      makeIds: [null],
      createdMake: {
        oemName: [null],
      },
      serialNumber: ['', [Validators.required]],
      productModel: ['', [Validators.required]],
      acquiredDate: [null!, [Validators.required]],
    });
  }
}
