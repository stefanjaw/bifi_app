/**
 * Represents a single translation record stored in the backend.
 */
export interface translationRecord {
  _id: string;
  locale: string;
  scope: string;
  key: string;
  value: string;
  active: boolean;
}

/** Form model for creating or editing a Translation */
export interface TranslationFormModel {
  locale: string;
  scope: string;
  key: string;
  value: string;
  active: boolean;
}
