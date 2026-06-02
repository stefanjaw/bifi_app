import { computed, effect, Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

export interface NotesModel {
  remark: string;
  createdBy: string;
  performDate: Date;
}

export interface LocationAssignmentModel {
  locationId: string;
  assignedQuantity: number;
}

export interface SoftwareConfigUpdateModel {
  regulatoryClassification: string | null;
  version: string | null;
  parentAssetId: string | null;
  udiDi: string | null;
  fdaMdrClass: string | null;
  licenseType: string | null;
  licenseKey: string | null;
  preventAutoUpdate: boolean;
}

interface UpdateAssetRosterFormModel {
  deviceType: string;
  serialNumber: string;
  assetTypeIds: string;
  makeIds: string;
  productModel: string;
  description: string | null;
  quantity: number | null;
  softwareConfiguration: SoftwareConfigUpdateModel;
  locationAssignments: LocationAssignmentModel[];
  acquiredDate: Date | null;
  vendorIds: string;
  condition: string | null;
  locationId: string;
  facilityId: string;
  acquiredPrice: number | null;
  currentPrice: number | null;
  warrantyDate: Date | null;
  supportEndDate: Date | null;
  remarks: NotesModel[] | null;
  aiquestion: string | null;
  photo: FormUploaderFile[];
  attachments: FormUploaderFile[];
  attachmentsMetadata: {
    descriptor: string;
  }[];
  maintenanceWindowIds: string | null;
  maintenanceDate: Date | null;
  commissionedDate: Date | null;
  estimatedEconomicLifeYears: number | null;
  salvageValue: number | null;
  depreciationMethod: string;
  accelerationFactor: number | null;
}

@Injectable({ providedIn: 'root' })
export class UpdateAssetRosterForm extends BaseForm<UpdateAssetRosterFormModel> {
  deviceType = toSignal(
    this.form.controls.deviceType.valueChanges.pipe(
      startWith(this.form.controls.deviceType.value),
    ),
  );

  totalAssigned = toSignal(
    this.form.controls.locationAssignments.valueChanges.pipe(
      startWith(this.form.controls.locationAssignments.value),
      map(rows => rows.reduce((sum: number, r: any) => sum + (r.assignedQuantity ?? 0), 0)),
    ),
    { initialValue: 0 },
  );

  totalAssignedMin = computed(() => Math.max(1, this.totalAssigned()));

  constructor() {
    super();

    effect(() => {
      const dt = this.deviceType();
      const swConfig = this.form.controls.softwareConfiguration;

      if (dt === 'software') {
        swConfig.get('regulatoryClassification')?.setValidators([Validators.required]);
        swConfig.get('version')?.setValidators([Validators.required]);
        swConfig.get('licenseType')?.setValidators([Validators.required]);
      } else {
        swConfig.get('regulatoryClassification')?.clearValidators();
        swConfig.get('version')?.clearValidators();
        swConfig.get('licenseType')?.clearValidators();
      }
      swConfig.get('regulatoryClassification')?.updateValueAndValidity();
      swConfig.get('version')?.updateValueAndValidity();
      swConfig.get('licenseType')?.updateValueAndValidity();
    });

    effect(() => {
      const minQty = this.totalAssignedMin();
      const quantityCtrl = this.form.controls.quantity;
      quantityCtrl.setValidators([Validators.min(minQty)]);
      quantityCtrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  override createForm() {
    return this.fb.group<UpdateAssetRosterFormModel>({
      deviceType: ['serialized'],
      serialNumber: [''],
      assetTypeIds: [''],
      makeIds: [''],
      productModel: [''],
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
      locationAssignments: {
        template: {
          locationId: [''],
          assignedQuantity: [0],
        },
        formArrayElements: [],
      },
      acquiredDate: [null],
      vendorIds: [''],
      condition: [null],
      locationId: [''],
      facilityId: [''],
      acquiredPrice: [null],
      currentPrice: [null],
      warrantyDate: [null],
      supportEndDate: [null],
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
      commissionedDate: [null],
      estimatedEconomicLifeYears: [null],
      salvageValue: [null],
      depreciationMethod: ['straight-line'],
      accelerationFactor: [200],
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

  createLocationAssignment(data: Partial<LocationAssignmentModel> = {}) {
    return this.fb.group<LocationAssignmentModel>({
      locationId: [data.locationId ?? ''],
      assignedQuantity: [data.assignedQuantity ?? 0],
    });
  }

  addLocationAssignment() {
    this.form.controls.locationAssignments.push(this.createLocationAssignment());
  }

  removeLocationAssignment(index: number) {
    this.form.controls.locationAssignments.removeAt(index);
  }
}
