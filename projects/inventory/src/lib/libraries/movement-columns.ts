import { tableColumn } from '@avalantec/base-app/resource';
import { stockMovement } from '../interfaces/stock-movement';

export const movementColumns: tableColumn<stockMovement>[] = [
  { field: 'productId.name', title: 'product', type: 'text' },
  { field: 'warehouseId.name', title: 'warehouse', type: 'text' },
  { field: 'locationId.name', title: 'location', type: 'text' },
  { field: 'quantity', title: 'quantity', type: 'number' },
  { field: 'unitCost', title: 'unitCost', type: 'currency' },
  { field: 'totalCost', title: 'totalCost', type: 'currency' },
  { field: 'type', title: 'type', type: 'text' },
  {
    field: 'adjustmentDirection',
    title: 'adjustmentDirection',
    type: 'text',
    parseField: (value: any) => (value ? String(value) : '—'),
  },
  { field: 'reference', title: 'reference', type: 'text' },
  {
    field: 'referenceType',
    title: 'referenceType',
    type: 'text',
    parseField: (value: any) => (value ? String(value) : '—'),
  },
  { field: 'date', title: 'date', type: 'date' },
];
