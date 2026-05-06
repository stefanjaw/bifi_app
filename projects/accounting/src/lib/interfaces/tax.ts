import { tax as BaseTax } from '@avalantec/base-app/taxes';
import { account } from './account';

export interface tax extends BaseTax {
  accountId: account;
}
