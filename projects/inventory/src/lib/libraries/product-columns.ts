import { tableColumn } from '@avalantec/base-app/resource';
import { product } from '../interfaces/product';

export const productColumns: tableColumn<product>[] = [
  { field: 'name', title: 'Name', type: 'text' },
  { field: 'sku', title: 'SKU', type: 'text' },
  {
    field: 'productTypeId' as any,
    title: 'Type',
    type: 'text',
    parseField: (value: any) => {
      if (value && typeof value === 'object') return (value.name ?? '').toString().trim() || '—';
      return (value ?? '').toString().trim() || '—';
    },
  },
  {
    field: 'unitOfMeasureId.symbol',
    title: 'UoM',
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
  { field: 'costPrice', title: 'Purchase Price', type: 'currency' },
  { field: 'salePrice', title: 'Sale Price', type: 'currency' },
  { field: 'active', title: 'Active', type: 'text' },
];
