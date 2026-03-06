export interface discount {
  _id: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  active: boolean;
}
