import { sequence } from '@avalantec/base-app/sequences';

export interface accountingSettings {
  _id?: string;
  invoiceSequence?: sequence | string;
  description?: string;
}
