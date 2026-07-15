import { tableColumn } from '@avalantec/base-app/resource';
import { product } from '../interfaces/product';

export const productColumns: tableColumn<product>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'sku', title: 'sku', type: 'text' },
  {
    field: 'productTypeId' as any,
    title: 'type',
    type: 'text',
    parseField: (value: any) => {
      if (value && typeof value === 'object') return (value.name ?? '').toString().trim() || '—';
      return (value ?? '').toString().trim() || '—';
    },
  },
  {
    field: 'unitOfMeasureId.symbol',
    title: 'uom',
    type: 'text',
    parseField: (value: any) => {
      if (value && typeof value === 'object') {
        const symbol = (value.symbol ?? '').toString().trim();
        if (symbol) return symbol;
        const name = (value.name ?? '').toString().trim();
        if (name) return name;
        return '—';
      }
      const s = (value ?? '').toString().trim();
      return s || '—';
    },
  },
  { field: 'costPrice', title: 'purchasePrice', type: 'currency' },
  { field: 'salePrice', title: 'salePrice', type: 'currency' },
  { field: 'active', title: 'active', type: 'text' },
];
