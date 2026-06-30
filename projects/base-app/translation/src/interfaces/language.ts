/**
 * Represents a supported UI language stored in the backend.
 */
export interface languageRecord {
  _id: string;
  locale: string;
  name: string;
  nativeName: string;
  active: boolean;
}

/** Form model for creating or editing a Language */
export interface LanguageFormModel {
  locale: string;
  name: string;
  nativeName: string;
  active: boolean;
}
