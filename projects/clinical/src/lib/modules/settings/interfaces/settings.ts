/** Lookup entity for genders */
export interface gender {
  _id: string;
  name: string;
  description: string;
  active: boolean;
}

/** Lookup entity for marital statuses */
export interface maritalStatus {
  _id: string;
  name: string;
  value: string;
  description: string;
  active: boolean;
}

/** Lookup entity for admission types */
export interface admissionType {
  _id: string;
  name: string;
  description: string;
  active: boolean;
}

/** Lookup entity for care continuum levels */
export interface careContinuumLevel {
  _id: string;
  name: string;
  value: string;
  description: string;
  active: boolean;
}

/** Lookup entity for races */
export interface race {
  _id: string;
  name: string;
  description: string;
  active: boolean;
}

/** Lookup entity for medical allergies */
export interface medicalAllergy {
  _id: string;
  name: string;
  acronym: string;
  description: string;
  active: boolean;
}

/** Lookup entity for medical precautions */
export interface medicalPrecaution {
  _id: string;
  name: string;
  description: string;
  active: boolean;
}

/** Lookup entity for progress note tags */
export interface progressNoteTag {
  _id: string;
  name: string;
  description: string;
  type: 'adverse' | 'incident';
  active: boolean;
}

/** Lookup entity for contact labels */
export interface contactLabel {
  _id: string;
  name: string;
  value: string;
  description: string;
  active: boolean;
}
