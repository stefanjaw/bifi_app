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
