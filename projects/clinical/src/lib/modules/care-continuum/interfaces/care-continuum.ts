import type {
  advanceDirectiveItem,
  historyItem,
  medicationItem,
  allergyItem,
  immunizationItem,
  precautionItem,
  healthCareProxy,
  externalProviderItem,
} from '../services/care-continuum-form';

/** Care continuum record entity */
export interface careContinuum {
  _id: string;
  patientId: string;
  typeOfEvent: 'Transfer' | 'Care Update' | 'Discharge' | 'Admission';
  careContinuumLevelId?: string;
  state: 'Draft' | 'Active' | 'Discharge';
  transferPoint?: string;
  assignedCaregiver?: string;
  assignedNurse?: string;
  unitId?: string;
  bedId?: string;
  roomId?: string;
  insuranceCarrier: string;
  planNumber?: string;
  groupNumber?: string;
  policyNumber: string;
  memberId?: string;
  effectiveDate?: string;
  endDate: string;
  genderAtBirth?: string;
  genderAtPresent?: string;
  race?: string;
  height?: number;
  weight?: number;
  advanceDirectives?: advanceDirectiveItem[];
  socialHistory?: historyItem[];
  familyHistory?: historyItem[];
  medicalHistory?: historyItem[];
  surgicalHistory?: historyItem[];
  medications?: medicationItem[];
  allergies?: allergyItem[];
  immunizations?: immunizationItem[];
  precautions?: precautionItem[];
  healthCareProxy?: healthCareProxy;
  externalProviders?: externalProviderItem[];
  extraFields?: Record<string, string>;
  createdBy?: string;
  updatedBy?: string;
  active: boolean;
}
