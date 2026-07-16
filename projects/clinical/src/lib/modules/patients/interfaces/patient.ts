import { contact } from '@avalantec/base-app/interfaces';

/** A patient record linked to a contact */
export interface patient {
  _id: string;
  dob: string;
  contactId: contact;
  maritalStatus?: string;
  language?: string;
  active: boolean;
}
