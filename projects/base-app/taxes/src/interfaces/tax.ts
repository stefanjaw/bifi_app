export interface tax {
  _id: string;
  name: string;
  taxType: 'sales' | 'purchase';
  percentage: number;
  active: boolean;
}
