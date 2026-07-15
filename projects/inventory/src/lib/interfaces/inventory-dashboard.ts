export interface InventoryDashboardProduct {
  _id: string;
  name: string;
  sku: string;
  totalQty: number;
}

export interface InventoryDashboardData {
  totalProducts: number;
  totalStockValue: number;
  outOfStockItems: number;
  lowStockItems: number;
  outOfStockProducts: InventoryDashboardProduct[];
  lowStockProducts: InventoryDashboardProduct[];
}
