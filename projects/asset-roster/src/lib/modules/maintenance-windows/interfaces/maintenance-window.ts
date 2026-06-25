export interface maintenanceWindow {
  _id: string;
  name: string;
  daysBefore: number;
  daysAfter: number;
  recurrency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi-anually' | 'annually';
  active: boolean;
}
