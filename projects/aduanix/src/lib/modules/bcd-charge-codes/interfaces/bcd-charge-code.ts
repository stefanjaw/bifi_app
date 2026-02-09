export interface bcdChargeCode {
  _id: string;
  code: string;
  name: string;
  description?: string;
  type: 'S' | 'D' | 'I' | 'E' | 'A';
  active?: boolean;
}
