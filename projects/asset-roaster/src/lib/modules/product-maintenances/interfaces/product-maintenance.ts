import { product } from '../../products';

export interface productMaintenance {
  _id: string;
  productId: product;
  name: string;
  description?: string;
  attachments: string[];
  date: string;
  type: 'service' | 'preventive-maintenance';
  active: boolean;
}
