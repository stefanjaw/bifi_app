import { effect, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';
import { startWith } from 'rxjs';

export interface SoftwareConfigFormModel {
  regulatoryClassification: string | null;
  version: string | null;
  parentAssetId: string | null;
  udiDi: string | null;
  fdaMdrClass: string | null;
  licenseType: string | null;
  licenseKey: string | null;
  preventAutoUpdate: boolean;
}

export interface CreateAssetRosterFormModel {
  deviceType: string;
  assetTypeIds: string | null;
  createdType: {
    name: string | null;
    description: string | null;
  };
  makeIds: string | null;
  createdMake: {
    oemName: string | null;
  };
  productModel: string | null;
  serialNumber: string | null;
  description: string | null;
  quantity: number | null;
  softwareConfiguration: SoftwareConfigFormModel;
  acquiredDate: Date;
}

@Injectable({ providedIn: 'root' })
export class CreateAssetRosterForm extends BaseForm<CreateAssetRosterFormModel> {
  assetType = toSignal(this.form.controls.assetTypeIds.valueChanges);
  make = toSignal(this.form.controls.makeIds.valueChanges);
  deviceType = toSignal(
    this.form.controls.deviceType.valueChanges.pipe(startWith(this.form.controls.deviceType.value))
  );

  constructor() {
    super();

    effect(() => {
      const dt = this.deviceType();

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

      const serialCtrl = this.form.controls.serialNumber;
      const modelCtrl = this.form.controls.productModel;
      const descCtrl = this.form.controls.description;
      const swConfig = this.form.controls.softwareConfiguration;

      if (dt === 'serialized' || !dt) {
        serialCtrl.clearValidators();
        modelCtrl.setValidators([Validators.required]);
        descCtrl.clearValidators();
        swConfig.get('regulatoryClassification')?.clearValidators();
        swConfig.get('version')?.clearValidators();
        swConfig.get('licenseType')?.clearValidators();
      } else if (dt === 'non-serialized') {
        serialCtrl.clearValidators();
        modelCtrl.clearValidators();
        descCtrl.setValidators([Validators.required]);
        swConfig.get('regulatoryClassification')?.clearValidators();
        swConfig.get('version')?.clearValidators();
        swConfig.get('licenseType')?.clearValidators();
      } else if (dt === 'software') {
        serialCtrl.clearValidators();
        modelCtrl.clearValidators();
        descCtrl.setValidators([Validators.required]);
        swConfig.get('regulatoryClassification')?.setValidators([Validators.required]);
        swConfig.get('version')?.setValidators([Validators.required]);
        swConfig.get('licenseType')?.setValidators([Validators.required]);
      }

      serialCtrl.updateValueAndValidity();
      modelCtrl.updateValueAndValidity();
      descCtrl.updateValueAndValidity();
      swConfig.get('regulatoryClassification')?.updateValueAndValidity();
      swConfig.get('version')?.updateValueAndValidity();
      swConfig.get('licenseType')?.updateValueAndValidity();
    });
  }

  override createForm() {
    return this.fb.group<CreateAssetRosterFormModel>({
      deviceType: ['serialized', [Validators.required]],
      assetTypeIds: [undefined!],
      createdType: {
        name: [null],
        description: [null],
      },
      makeIds: [null!],
      createdMake: {
        oemName: [null],
      },
      serialNumber: [null],
      productModel: [null, [Validators.required]],
      description: [null],
      quantity: [null],
      softwareConfiguration: {
        regulatoryClassification: [null],
        version: [null],
        parentAssetId: [null],
        udiDi: [null],
        fdaMdrClass: [null],
        licenseType: [null],
        licenseKey: [null],
        preventAutoUpdate: [false],
      },
      acquiredDate: [null!, [Validators.required]],
    });
  }
}
