import { file } from '@avalantec/base-app/resource';
import { product } from '../../products';

export interface productMaintenance {
  _id: string;
  productId: product;
  name: string;
  description?: string;
  notes?: string;
  attachments: file[];
  date: string;
  type: 'service' | 'preventive-maintenance';
  active: boolean;
}
