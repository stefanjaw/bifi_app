import { contact } from '@avalantec/base-app/core';
import { country } from '../../countries';

export interface company {
  _id: string;
  name: string;
  countryId: country;
  address: string;
  contactId: contact;
  active: boolean;
}
