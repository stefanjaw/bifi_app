/** A vendor record linked to a Contact */
export interface vendor {
  _id: string;
  contactId: string;
  positionRoles: string[];
  startDate: string;
  endDate?: string;
  engagementAgreement: vendorDocument[];
  vendorId: string;
  credentials: string[];
  licenseCertificationType: 'Prepared foods vendor';
  licenseNumber: string;
  licenseExpirationDate: string;
  credentialDocuments: vendorDocument[];
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** A file reference with description for vendors */
export interface vendorDocument {
  fileId: string;
  description: string;
}
