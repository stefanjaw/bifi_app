import { country } from '@avalantec/base-app/settings';

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
  streetAddress?: string;
  streetAddress2?: string;
  active: boolean;
}
