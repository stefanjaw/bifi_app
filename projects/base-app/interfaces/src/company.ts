import { contact } from './contact';
import { country } from './country';

export interface company {
  _id: string;
  name: string;
  type?: 'company' | 'branch-office';
  countryId: country;
  address: string;
  contactId: contact;
  active: boolean;
  defaultCurrencyId?: string;
  parentCompany?: company;
  branchCode?: string;
  isDefault?: boolean;
}
