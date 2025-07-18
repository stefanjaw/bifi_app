import { contact } from '@avalantec/base-app';
import { room } from './room';

export interface facility {
  _id: string;
  name: string;
  mainPlace: contact;
  rooms: room[];
  active: boolean;
}
