import { file } from '@avalantec/base-app/resource';
import { assetRoster } from '../../asset-roster';

export interface assetMaintenance {
  _id: string;
  assetRosterId: assetRoster;
  name: string;
  description?: string;
  notes?: string;
  attachments: file[];
  dateStart: string;
  dateEnd: string;
  type: 'service' | 'preventive-maintenance';
  active: boolean;
}
