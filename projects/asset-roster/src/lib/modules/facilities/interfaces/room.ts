import { facility } from './facility';

export interface room {
  _id: string;
  name: string;
  code: string;
  address: string;
  facilityId: facility;
  active: boolean;
}
