export interface bcdTaxType {
  _id: string;
  code: string;
  name: string;
  description?: string;
  impact?: {
    wharfageRate: boolean;
  };
  active: boolean;
}
