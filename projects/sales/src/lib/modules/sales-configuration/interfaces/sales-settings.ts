import { sequence } from '@avalantec/base-app/sequences';

export interface salesSettings {
  _id?: string;
  orderSequence?: sequence | string;
  description?: string;
}
