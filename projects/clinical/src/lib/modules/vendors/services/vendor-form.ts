import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';
import { vendorDocument } from '../interfaces/vendors';

/** Form model for vendor create/edit */
export interface VendorFormModel {
  _id: string;
  contactId: string;
  positionRoles: string;
  startDate: string;
  endDate: string;
  engagementAgreement: vendorDocument[];
  vendorId: string;
  credentials: string;
  licenseCertificationType: string;
  licenseNumber: string;
  licenseExpirationDate: string;
  credentialDocuments: vendorDocument[];
  active: boolean;
}

/** Form service for vendor create/edit */
@Injectable({ providedIn: 'root' })
export class VendorForm extends BaseForm<VendorFormModel> {
  override createForm() {
    return this.fb.group<VendorFormModel>({
      _id: [''],
      contactId: [''],
      positionRoles: [''],
      startDate: [''],
      endDate: [''],
      engagementAgreement: {
        template: { fileId: [''], description: [''] },
        formArrayElements: [],
      },
      vendorId: [''],
      credentials: [''],
      licenseCertificationType: ['Prepared foods vendor'],
      licenseNumber: [''],
      licenseExpirationDate: [''],
      credentialDocuments: {
        template: { fileId: [''], description: [''] },
        formArrayElements: [],
      },
      active: [true],
    });
  }
}
