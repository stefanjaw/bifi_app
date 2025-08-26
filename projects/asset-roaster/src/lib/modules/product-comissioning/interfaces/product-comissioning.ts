import { file } from '@avalantec/base-app/resource';
import { product } from '../../products';

export interface productComissionnig {
  _id: string;
  outcome: 'fail' | 'pass';
  details?: string;
  attachments?: file[];
  productId: product;
  active: boolean;
}
