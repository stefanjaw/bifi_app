import { bcdTaxId, bcdTaxType } from '../../bcd-taxes';
import { bcdType } from '../../bcd-types';

export interface bcdCpc {
  _id: string;
  code: string;
  description: string;
  bcdTypes?: bcdType[];
  tax: {
    taxType: bcdTaxType;
    taxId: bcdTaxId;
  }[];
  dutyRate: {
    type: 'SPECIFICATION' | 'MULTIPLIER';
    value: number | string;
  };
}
