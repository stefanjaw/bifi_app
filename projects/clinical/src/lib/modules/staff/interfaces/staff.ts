/** A staff member record linked to a Contact */
export interface staff {
  _id: string;
  contactId: string;
  engagementType: 'Employee' | 'Contractor';
  position: 'Nurse' | 'Caregiver' | 'Manager' | 'Other';
  startDate: string;
  endDate?: string;
  workPermitRequired: boolean;
  workPermitDocuments: staffDocument[];
  engagementAgreement: staffDocument[];
  personnelId: string;
  department: string;
  licenseCertificationType: 'Registered Nurse' | 'MD' | 'LPN' | 'Other';
  licenseNumber: string;
  licenseExpirationDate: string;
  credentials: string[];
  credentialDocuments: staffDocument[];
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** A file reference with description */
export interface staffDocument {
  fileId: string;
  description: string;
}

/** A staff group with assigned members */
export interface staffGroup {
  _id: string;
  name: string;
  description: string;
  staffIds: staffIdEntry[];
  active: boolean;
}

/** A staff member entry within a group */
export interface staffIdEntry {
  staffId: string;
  role: 'Supervisor' | 'Nurse' | 'Caregiver' | 'Charge Nurse';
}

/** A shift assignment */
export interface shift {
  _id: string;
  name: string;
  manager: string;
  timeStart: string;
  timeEnd: string;
  dateStart: string;
  dateEnd?: string;
  type: 'Morning' | 'Evening' | 'Afternoon';
  weekdays: shiftWeekday[];
  staffId: string;
  patientId: string;
  active: boolean;
}

/** A weekday entry in a shift with assigned groups */
export interface shiftWeekday {
  weekday: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  groupIds: string[];
}
