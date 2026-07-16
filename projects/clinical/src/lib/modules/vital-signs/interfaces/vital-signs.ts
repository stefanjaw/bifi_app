/** A vital signs record with measured values for a patient */
export interface vitalSign {
  _id: string;
  dateVital?: string;
  measuredVitals: { value: string; method: string; vitalSignTypeId: string }[];
  patientId: string;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** A vital sign type definition with name, unit, and reference ranges */
export interface vitalSignType {
  _id: string;
  name: string;
  value: string;
  unit: string;
  ranges: { name: string; color: string; min: number; max: number }[];
  active: boolean;
}
