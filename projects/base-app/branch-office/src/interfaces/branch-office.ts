import { company } from '@avalantec/base-app/interfaces';
import { country } from '@avalantec/base-app/interfaces';

export interface branchOffice {
  _id: string;
  companyId: company;
  name: string;
  branchCode: string;
  address: string;
  phone?: string;
  email?: string;
  countryId?: country;
  active: boolean;
  isDefault: boolean;
}
