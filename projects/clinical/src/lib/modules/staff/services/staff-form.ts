import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';
import { staffDocument } from '../interfaces/staff';

/** Form model for staff create/edit */
export interface StaffFormModel {
  _id: string;
  contactId: string;
  engagementType: string;
  position: string;
  startDate: string;
  endDate: string;
  workPermitRequired: boolean;
  workPermitDocuments: staffDocument[];
  engagementAgreement: staffDocument[];
  personnelId: string;
  department: string;
  licenseCertificationType: string;
  licenseNumber: string;
  licenseExpirationDate: string;
  credentials: string;
  credentialDocuments: staffDocument[];
  active: boolean;
}

/** Form service for staff member create/edit */
@Injectable({ providedIn: 'root' })
export class StaffForm extends BaseForm<StaffFormModel> {
  override createForm() {
    return this.fb.group<StaffFormModel>({
      _id: [''],
      contactId: [''],
      engagementType: ['Employee'],
      position: ['Nurse'],
      startDate: [''],
      endDate: [''],
      workPermitRequired: [false],
      workPermitDocuments: {
        template: { fileId: [''], description: [''] },
        formArrayElements: [],
      },
      engagementAgreement: {
        template: { fileId: [''], description: [''] },
        formArrayElements: [],
      },
      personnelId: [''],
      department: [''],
      licenseCertificationType: ['Other'],
      licenseNumber: [''],
      licenseExpirationDate: [''],
      credentials: [''],
      credentialDocuments: {
        template: { fileId: [''], description: [''] },
        formArrayElements: [],
      },
      active: [true],
    });
  }
}
