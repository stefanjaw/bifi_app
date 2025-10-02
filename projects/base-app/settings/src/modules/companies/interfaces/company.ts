import { contact } from '@avalantec/base-app/core';

export interface company {
  _id: string;
  name: string;
  countryId: { name: string };
  address: string;
  contactId: contact;
  active: boolean;
}
