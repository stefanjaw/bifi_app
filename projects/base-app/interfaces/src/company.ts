import { contact } from './contact';
import { country } from './country';

export interface company {
  _id: string;
  name: string;
  countryId: country;
  address: string;
  contactId: contact;
  active: boolean;
}
