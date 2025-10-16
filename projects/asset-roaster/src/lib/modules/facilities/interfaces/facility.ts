import { contact } from '@avalantec/base-app/interfaces';
import { room } from './room';

export interface facility {
  _id: string;
  name: string;
  contactId: contact;
  rooms: room[];
  active: boolean;
}
