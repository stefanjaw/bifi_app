import { uomCategory } from './uom-category';

export interface uom {
  _id: string;
  name: string;
  symbol?: string;
  categoryId?: uomCategory;
  active?: boolean;
}
