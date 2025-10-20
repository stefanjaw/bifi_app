import { country } from './country';

export interface contact {
  _id: string;
  name: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  parentId?: contact;
  type: 'individual' | 'company';
  childIds?: contact[];
  countryId?: country;
  state?: string;
  city?: string;
  zipCode?: string;
  streetAddress?: string;
  streetAddress2?: string;
  active: boolean;
}
