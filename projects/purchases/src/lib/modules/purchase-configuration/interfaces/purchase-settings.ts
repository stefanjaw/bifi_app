import { sequence } from '@avalantec/base-app/sequences';

export interface purchaseSettings {
  _id?: string;
  purchaseSequence?: sequence | string;
  description?: string;
}
