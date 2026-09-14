import { sequence } from '@avalantec/base-app/sequences';
import { account } from '../../../interfaces/account';

export interface accountingSettings {
  _id?: string;
  invoiceSequence?: sequence | string;
  purchasePayableAccountId?: account | string;
  description?: string;
}
