export interface revenueByStageEntry {
  stageName: string;
  total: number;
}

export interface topSalesRepEntry {
  username: string;
  total: number;
}

export interface salesDashboard {
  totalRevenueMTD: number;
  totalRevenue: number;
  openOpportunitiesValue: number;
  closedWonCount: number;
  conversionRate: number;
  revenueByStage: revenueByStageEntry[];
  topSalesReps: topSalesRepEntry[];
}
