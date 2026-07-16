import { tableColumn } from '@avalantec/base-app/resource';
import {
  gender,
  maritalStatus,
  admissionType,
  careContinuumLevel,
  race,
  medicalAllergy,
  medicalPrecaution,
  contactLabel,
} from '../interfaces/settings';

/** Column definitions for the genders table */
export const genderColumns: tableColumn<gender>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Column definitions for the marital statuses table */
export const maritalStatusColumns: tableColumn<maritalStatus>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'value', title: 'value', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Column definitions for the admission types table */
export const admissionTypeColumns: tableColumn<admissionType>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Column definitions for the care continuum levels table */
export const careContinuumLevelColumns: tableColumn<careContinuumLevel>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'value', title: 'value', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Column definitions for the races table */
export const raceColumns: tableColumn<race>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Column definitions for the medical allergies table */
export const medicalAllergyColumns: tableColumn<medicalAllergy>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'acronym', title: 'acronym', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Column definitions for the medical precautions table */
export const medicalPrecautionColumns: tableColumn<medicalPrecaution>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];

/** Column definitions for the contact labels table */
export const contactLabelColumns: tableColumn<contactLabel>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'value', title: 'value', type: 'text' },
  { field: 'description', title: 'description', type: 'text' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];
