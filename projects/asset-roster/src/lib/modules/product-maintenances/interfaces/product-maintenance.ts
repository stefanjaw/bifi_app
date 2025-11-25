import { file } from '@avalantec/base-app/resource';
import { product } from '../../products';

export interface productMaintenance {
  _id: string;
  productId: product;
  name: string;
  description?: string;
  notes?: string;
  attachments: file[];
  dateStart: string;
  dateEnd: string;
  type: 'service' | 'preventive-maintenance';
  active: boolean;
}
