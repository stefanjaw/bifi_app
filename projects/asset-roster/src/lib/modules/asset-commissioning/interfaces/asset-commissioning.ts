import { file } from '@avalantec/base-app/resource';
import { assetRoster } from '../../asset-roster';

export interface assetCommissionning {
  _id: string;
  outcome: 'fail' | 'pass';
  details?: string;
  attachments?: file[];
  assetRosterId: assetRoster;
  active: boolean;
}
