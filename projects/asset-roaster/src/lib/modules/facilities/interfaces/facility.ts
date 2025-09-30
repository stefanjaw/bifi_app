import { contact } from '@avalantec/base-app/settings';
import { room } from './room';

export interface facility {
  _id: string;
  name: string;
  contactId: contact;
  rooms: room[];
  active: boolean;
}
