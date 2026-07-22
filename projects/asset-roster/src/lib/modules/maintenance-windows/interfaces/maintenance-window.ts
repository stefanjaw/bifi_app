export interface maintenanceWindow {
  _id: string;
  name: string;
  daysBefore: number;
  daysAfter: number;
  recurrency:
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'quarterly'
    | 'semi-anually'
    | 'semi-annually'
    | 'annually';
  active: boolean;
}
