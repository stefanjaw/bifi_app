import { tableColumn } from '@avalantec/base-app/resource';
import { stockMovement } from '../interfaces/stock-movement';

export const movementColumns: tableColumn<stockMovement>[] = [
  { field: 'productId.name', title: 'Product', type: 'text' },
  { field: 'warehouseId.name', title: 'Warehouse', type: 'text' },
  { field: 'locationId.name', title: 'Location', type: 'text' },
  { field: 'quantity', title: 'Quantity', type: 'number' },
  { field: 'type', title: 'Type', type: 'text' },
  { field: 'reference', title: 'Reference', type: 'text' },
  { field: 'date', title: 'Date', type: 'date' },
];
