import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface NotesModel{
  remark: string;
  createdBy: string;
  performDate: Date;
}
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
  remarks: NotesModel[] | null;
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
        template: {
          remark: [''],
          createdBy: [''],
          performDate: [new Date()],
        },
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

createRemark(data: Partial<NotesModel>) {
  return this.fb.group<NotesModel>({
    remark: [data.remark ?? ''],
    createdBy: [data.createdBy ?? ''],
    performDate: [data.performDate ?? new Date()],
  });
}

addRemark(remark: string, userId: string) {
  if (!remark?.trim()) return;

  const form = this.createRemark({
    remark,
    createdBy: userId,
    performDate: new Date(),
  });

  const remarksArray = this.form.controls.remarks;
  remarksArray.push(form);
}

  removeRemark(index: number) {
    const remarksArray = this.form.controls.remarks;
    remarksArray.removeAt(index);
  }
  
}
