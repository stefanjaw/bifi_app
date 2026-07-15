import { contact } from './contact';
import { role } from './role';

export interface user {
  _id: string;
  authId: string;
  provider: string;
  username: string;
  email: string;
  picture: string;
  uploadedPictureId?: string;
  roles: role[];
  contactId?: contact;
  active: boolean;
  confirmed: boolean;
  /** Preferred locale code, e.g. "en" or "es". Persisted via PUT /api/users/me/language */
  language?: string;
}
