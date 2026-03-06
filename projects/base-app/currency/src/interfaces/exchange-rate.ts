import { currency } from './currency';

export interface exchangeRate {
  _id: string;
  fromCurrencyId: currency;
  toCurrencyId: currency;
  rate: number;
  effectiveDate: string;
  active: boolean;
}
