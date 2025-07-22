import { product } from '../../products';

export interface productComissionnig {
  _id: string;
  outcome: 'fail' | 'pass';
  details?: string;
  attachments: string[];
  productId: product;
  active: boolean;
}
