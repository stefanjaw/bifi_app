import { tax } from './tax';
import { account } from './account';

export interface taxMapping {
  fromTaxId: tax;
  toTaxId: tax;
}

export interface accountMapping {
  fromAccountId: account;
  toAccountId: account;
}

export interface fiscalPosition {
  _id: string;
  name: string;
  active: boolean;
  taxMappings: taxMapping[];
  accountMappings: accountMapping[];
}
