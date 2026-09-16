import { sequence } from '@avalantec/base-app/sequences';
import { account } from '../../../interfaces/account';
import { currency } from '@avalantec/base-app/currency';

export interface accountingSettings {
  _id?: string;
  invoiceSequence?: sequence | string;
  purchasePayableAccountId?: account | string;
  discountGrantedAccountId?: account | string;
  inventoryAccounts?: {
    inventoryAccountId?: account | string;
    cogsAccountId?: account | string;
    adjustmentLossAccountId?: account | string;
    apPendingAccountId?: account | string;
    defaultCurrencyId?: currency | string;
  };
  description?: string;
}
