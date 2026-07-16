import { filter } from '@avalantec/base-app/resource';

/** Filter configuration for the genders list */
export const genderFilters: filter[] = [
  { field: 'name', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for the marital statuses list */
export const maritalStatusFilters: filter[] = [
  { field: 'name', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for the admission types list */
export const admissionTypeFilters: filter[] = [
  { field: 'name', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for the care continuum levels list */
export const careContinuumLevelFilters: filter[] = [
  { field: 'name', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for the races list */
export const raceFilters: filter[] = [
  { field: 'name', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for the medical allergies list */
export const medicalAllergyFilters: filter[] = [
  { field: 'name', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for the medical precautions list */
export const medicalPrecautionFilters: filter[] = [
  { field: 'name', type: 'string' },
  { field: 'active', type: 'boolean' },
];

/** Filter configuration for the contact labels list */
export const contactLabelFilters: filter[] = [
  { field: 'name', type: 'string' },
  { field: 'active', type: 'boolean' },
];
