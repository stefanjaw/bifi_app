import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

interface UpdateAssetRosterFormModel {
  serialNumber: string;
  assetTypeIds: string;
  makeIds: string;
  productModel: string;
  acquiredDate: Date | null;
  vendorIds: string;
  condition: string | null;
  locationId: string;
  facilityId: string;
  acquiredPrice: number | null;
  currentPrice: number | null;
  warrantyDate: Date | null;
  remarks: string[];
  aiquestion: string | null;
  photo: FormUploaderFile[];
  attachments: FormUploaderFile[];
  attachmentsMetadata: {
    descriptor: string;
  }[];
  maintenanceWindowIds: string | null;
  maintenanceDate: Date | null;
}

@Injectable({ providedIn: 'root' })
export class UpdateAssetRosterForm extends BaseForm<UpdateAssetRosterFormModel> {
  override createForm() {
    return this.fb.group<UpdateAssetRosterFormModel>({
      serialNumber: ['0010101', [Validators.required]],
      assetTypeIds: ['Test type'],
      makeIds: ['OEMTEST'],
      productModel: ['TestModel'],
      acquiredDate: [new Date()],
      vendorIds: [''],
      condition: [null],
      locationId: [''],
      facilityId: [''],
      acquiredPrice: [null, Validators.min(1)],
      currentPrice: [null, Validators.min(1)],
      warrantyDate: [null],
      remarks: {
        template: [''],
        formArrayElements: [],
      },
      aiquestion: [''],
      photo: {
        template: {
          id: [''],
          file: [null!],
        },
        formArrayElements: [],
      },
      attachments: {
        template: {
          id: [''],
          file: [null!],
        },
        formArrayElements: [],
      },
      attachmentsMetadata: {
        template: {
          descriptor: [''],
        },
        formArrayElements: [],
      },
      maintenanceWindowIds: [null],
      maintenanceDate: [null],
    });
  }


    addRemark(value: string = '') {
    const remarksArray = this.form.controls.remarks;

    remarksArray.push(
      new FormControl<string>(value, { nonNullable: true })
    );
  }

  removeRemark(index: number) {
    const remarksArray = this.form.controls.remarks;
    remarksArray.removeAt(index);
  }
}
