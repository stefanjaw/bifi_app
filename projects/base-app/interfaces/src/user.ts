import { contact } from './contact';
import { role } from './role';

export interface user {
  _id: string;
  authId: string;
  provider: string;
  username: string;
  email: string;
  picture: string;
  roles: role[];
  contactId?: contact;
}
